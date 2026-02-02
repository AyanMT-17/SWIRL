import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Product, ProductProperties } from '@/constants/mockData';

// ============================================================================
// Types
// ============================================================================

// Backend product structure (from /products endpoint)
export interface BackendProduct {
    _id: string;
    item_id?: number; // Numeric ID from Myntra/Backend
    name: string;
    brand: string;
    price: number;
    image_url: string;
    gender: string;
    category: string;
    subcategory?: string;
    style?: string;
    primary_color?: string;
    attributes_json?: {
        size_availability?: { size: string; available: boolean }[];
        specifications?: Record<string, string>;
    };
}

// Storage keys
const STORAGE_KEYS = {
    SWIPED_PRODUCT_IDS: '@swirl_swiped_ids',
    LIKED_PRODUCT_IDS: '@swirl_liked_ids',
};

// Pre-fetch threshold: when this many products are left, fetch more
const PREFETCH_THRESHOLD = 10;
const PAGE_SIZE = 20;

interface ProductFeedContextType {
    // State
    products: Product[];
    currentIndex: number;
    isLoading: boolean;
    isPreFetching: boolean;
    hasMore: boolean;
    error: string | null;

    // Derived
    currentProduct: Product | null;
    nextProduct: Product | null;
    remainingCount: number;

    // Actions
    handleSwipeRight: (product: Product) => Promise<void>;
    handleSwipeLeft: (product: Product) => Promise<void>;
    refreshFeed: () => Promise<void>;
    resetFeed: () => Promise<void>;

    // For Swirl page (liked products)
    likedProductIds: string[];
    getLikedProducts: () => Product[];
    removeFromLiked: (productId: string) => Promise<void>;

    // For product detail page
    getProductById: (id: string | number) => Product | undefined;
}

// ============================================================================
// Context
// ============================================================================

const ProductFeedContext = createContext<ProductFeedContextType | undefined>(undefined);

export function useProductFeed() {
    const context = useContext(ProductFeedContext);
    if (context === undefined) {
        throw new Error('useProductFeed must be used within a ProductFeedProvider');
    }
    return context;
}

// ============================================================================
// Helper: Convert backend product to app Product format
// ============================================================================

export const convertToAppProduct = (backendProduct: BackendProduct): Product => {
    // Assign properties based on backend data
    const getPriceTier = (price: number): ProductProperties['price_tier'] => {
        if (price < 1000) return 'budget';
        if (price > 10000) return 'luxury';
        if (price > 5000) return 'premium';
        return 'mid';
    };

    const getCategoryType = (category: string, subcategory?: string): ProductProperties['category'] => {
        const lower = (category + ' ' + (subcategory || '')).toLowerCase();
        if (lower.includes('foot') || lower.includes('shoe') || lower.includes('sandal') || lower.includes('sneaker')) return 'footwear';
        if (lower.includes('bottom') || lower.includes('pant') || lower.includes('jean') || lower.includes('skirt') || lower.includes('trouser') || lower.includes('short')) return 'bottom';
        if (lower.includes('dress')) return 'dress';
        if (lower.includes('jacket') || lower.includes('outer') || lower.includes('coat') || lower.includes('blazer')) return 'outerwear';
        if (lower.includes('bag') || lower.includes('watch') || lower.includes('jewelry') || lower.includes('accessory')) return 'accessories';
        return 'top';
    };

    const getColorFamily = (color?: string): ProductProperties['color_family'] => {
        if (!color) return 'monochrome';
        const lower = color.toLowerCase();
        if (['black', 'white', 'grey', 'gray'].includes(lower)) return 'monochrome';
        if (['brown', 'beige', 'khaki', 'tan'].includes(lower)) return 'earth';
        if (['pink', 'lavender', 'mint'].includes(lower)) return 'pastel';
        if (['red', 'orange', 'yellow'].includes(lower)) return 'vibrant';
        if (['navy', 'maroon', 'dark'].includes(lower)) return 'dark';
        return 'light';
    };

    const fixImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/600x800/png?text=No+Image';
        // Replace Myntra placeholders
        return url
            .replace('($height)', '720')
            .replace('($width)', '540')
            .replace('($qualityPercentage)', '90');
    };

    const categoryType = getCategoryType(backendProduct.category, backendProduct.subcategory);
    // Map internal category type to display category (Top, Bottom, Foot)
    const displayCategory = categoryType === 'footwear' ? 'Foot' :
        categoryType === 'bottom' ? 'Bottom' :
            categoryType === 'accessories' ? 'Accessories' :
                'Top'; // Default to Top

    return {
        id: String(backendProduct.item_id || backendProduct._id),
        name: backendProduct.name,
        brand: backendProduct.brand,
        price: backendProduct.price,
        original_price: Math.round(backendProduct.price * 1.2), // Assume 20% discount
        discount_percentage: 20,
        product_images: [{ image_url: fixImageUrl(backendProduct.image_url) }],
        category: displayCategory, // Use mapped category for main display
        categories: [displayCategory, backendProduct.category, backendProduct.subcategory || backendProduct.category],
        has_free_delivery: backendProduct.price > 499,
        delivery_date: 'Tomorrow',
        description: `${backendProduct.brand} ${backendProduct.name}`,
        properties: {
            style: (backendProduct.style?.toLowerCase() || 'casual') as ProductProperties['style'],
            price_tier: getPriceTier(backendProduct.price),
            color_family: getColorFamily(backendProduct.primary_color),
            category: categoryType,
            fit: (backendProduct.attributes_json?.specifications?.['Fit'] || 'regular').toLowerCase() as any,
            fabric: (backendProduct.attributes_json?.specifications?.['Fabrics'] || backendProduct.attributes_json?.specifications?.['Fabric'] || 'cotton').toLowerCase() as any,
            occasion: (backendProduct.attributes_json?.specifications?.['Occasions'] || backendProduct.attributes_json?.specifications?.['Occasion'] || 'daily').toLowerCase() as any,
            season: 'all_year',
        },
    };
};

// ============================================================================
// Provider
// ============================================================================

export function ProductFeedProvider({ children }: { children: React.ReactNode }) {
    const { isOnboardingComplete, preferences, setLikes, setDislikes, savePreferences } = useUserPreferences();

    // State
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [swipedProductIds, setSwipedProductIds] = useState<Set<string>>(new Set());
    const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPreFetching, setIsPreFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Ref to track if initial load happened
    const initialLoadDone = useRef(false);
    const interactionCount = useRef(0);
    const INTERACTION_SYNC_THRESHOLD = 8;

    // Filtered products (not swiped)
    const products = allProducts.filter(p => !swipedProductIds.has(p.id));
    const currentIndex = 0; // Always show first unswiped product
    const currentProduct = products[0] || null;
    const nextProduct = products[1] || null;
    const remainingCount = products.length;

    // --------------------------------------------------------------------------
    // Load persisted data
    // --------------------------------------------------------------------------
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                const [swipedStr, likedStr] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.SWIPED_PRODUCT_IDS),
                    AsyncStorage.getItem(STORAGE_KEYS.LIKED_PRODUCT_IDS),
                ]);

                if (swipedStr) setSwipedProductIds(new Set(JSON.parse(swipedStr)));
                if (likedStr) setLikedProductIds(JSON.parse(likedStr));
            } catch (err) {
                console.error('[ProductFeed] Error loading persisted data:', err);
            }
        };

        loadPersistedData();
    }, []);

    // --------------------------------------------------------------------------
    // Fetch products from backend
    // --------------------------------------------------------------------------
    const fetchProducts = useCallback(async (page: number, isInitial: boolean = false) => {
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsPreFetching(true);
        }
        setError(null);

        try {
            let response;

            // Use personalized recommendations if onboarding is complete
            if (isOnboardingComplete && isInitial) {
                console.log('[ProductFeed] Fetching personalized recommendations...');
                try {
                    response = await API.products.getRecommendations();
                    const recommendedProducts = (response.data || []).map(convertToAppProduct);

                    if (recommendedProducts.length > 0) {
                        setAllProducts(recommendedProducts);
                        console.log(`[ProductFeed] Loaded ${recommendedProducts.length} personalized products`);
                        return;
                    }
                } catch (recError) {
                    console.warn('[ProductFeed] Recommendations failed, falling back to paginated:', recError);
                }
            }

            // Fallback to paginated products
            console.log(`[ProductFeed] Fetching page ${page}...`);
            response = await API.products.getAll(page, PAGE_SIZE);

            const { data, meta } = response.data;
            let newProducts = (data || []).map(convertToAppProduct);

            // Apply frontend recommendation logic to sort/filter fetched products
            // REMOVED: User requested backend-driven logic only.
            // Using backend recommendations directly in the block above.

            if (isInitial) {
                setAllProducts(newProducts);
            } else {
                setAllProducts(prev => {
                    // Filter out duplicates (backend might return same recommendations)
                    const existingIds = new Set(prev.map((p: Product) => p.id));
                    const uniqueNew = newProducts.filter((p: Product) => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            }

            setCurrentPage(page);
            setHasMore(page < (meta?.totalPages || 1));
            console.log(`[ProductFeed] Loaded ${newProducts.length} products (page ${page}/${meta?.totalPages})`);

        } catch (err: any) {
            console.error('[ProductFeed] Fetch error:', err);
            setError(err.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
            setIsPreFetching(false);
        }
    }, [isOnboardingComplete]);

    // Initial load
    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            fetchProducts(1, true);
        }
    }, [fetchProducts]);

    // --------------------------------------------------------------------------
    // Pre-fetch trigger
    // --------------------------------------------------------------------------
    useEffect(() => {
        // When remaining products drop below threshold, pre-fetch
        if (remainingCount <= PREFETCH_THRESHOLD && hasMore && !isPreFetching && !isLoading) {
            console.log(`[ProductFeed] Pre-fetch triggered (${remainingCount} remaining)`);
            fetchProducts(currentPage + 1, false);
        }
    }, [remainingCount, hasMore, isPreFetching, isLoading, currentPage, fetchProducts]);

    // --------------------------------------------------------------------------
    // Swipe handlers
    // --------------------------------------------------------------------------
    const handleSwipeRight = useCallback(async (product: Product) => {
        const productId = product.id;

        // 1. Mark as swiped
        setSwipedProductIds(prev => {
            const newSet = new Set(prev);
            newSet.add(productId);
            AsyncStorage.setItem(STORAGE_KEYS.SWIPED_PRODUCT_IDS, JSON.stringify([...newSet]));
            return newSet;
        });

        // 2. Add to liked
        setLikedProductIds(prev => {
            if (!prev.includes(productId)) {
                const newLiked = [...prev, productId];
                AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCT_IDS, JSON.stringify(newLiked));
                return newLiked;
            }
            return prev;
        });

        // 3. Record interaction to backend
        try {
            await API.interactions.record('LIKE', Number(productId));

            // 4. Update Preferences Locally & Sync
            if (preferences) {
                // Extract tags to reinforce
                const tagsToCheck = [
                    product.brand,
                    product.category,
                    ...(product.categories || []),
                    product.properties?.style,
                    product.properties?.color_family
                ].filter(Boolean) as string[];

                const newLikes = [...new Set([...preferences.likes, ...tagsToCheck])];
                if (newLikes.length > preferences.likes.length) {
                    setLikes(newLikes);
                }
            }

            // 5. Check Sync Threshold
            interactionCount.current += 1;
            if (interactionCount.current % INTERACTION_SYNC_THRESHOLD === 0) {
                console.log('[ProductFeed] Syncing preferences and refreshing recommendations...');
                await savePreferences();
                // Fetch fresh recommendations to append
                fetchProducts(currentPage, true); // true = treats as "initial" logic which calls getRecommendations, but we need to ensure it APPENDS if we want flow.
                // Actually, 'isInitial=true' REPLACES the list. 
                // We want to APPEND specific recommendations.
                // Let's manually call API here to be safe and append.
                try {
                    const res = await API.products.getRecommendations();
                    const recs = (res.data || []).map(convertToAppProduct);
                    if (recs.length > 0) {
                        setAllProducts(prev => {
                            const existingIds = new Set(prev.map((p: Product) => p.id));
                            const unique = recs.filter((p: Product) => !existingIds.has(p.id));
                            return [...prev, ...unique];
                        });
                    }
                } catch (e) {
                    console.warn('Failed to refresh recs', e);
                }
            }

        } catch (err) {
            console.warn('[ProductFeed] Failed to record LIKE interaction:', err);
        }
    }, [preferences, setLikes, savePreferences, fetchProducts, currentPage]);

    const handleSwipeLeft = useCallback(async (product: Product) => {
        const productId = product.id;

        // 1. Mark as swiped
        setSwipedProductIds(prev => {
            const newSet = new Set(prev);
            newSet.add(productId);
            AsyncStorage.setItem(STORAGE_KEYS.SWIPED_PRODUCT_IDS, JSON.stringify([...newSet]));
            return newSet;
        });

        // 3. Record interaction to backend
        try {
            await API.interactions.record('DISLIKE', Number(productId));

            // 4. Update Preferences Locally & Sync
            if (preferences) {
                // Extract tags to reinforce dislikes
                const tagsToCheck = [
                    product.brand,
                    product.category,
                    ...(product.categories || []),
                    product.properties?.style,
                    product.properties?.color_family
                ].filter(Boolean) as string[];

                // Add to dislikes if not present (simple unique add)
                // Note: logic could be smarter (only dislike if repeated?), but for now precise dislike.
                // Actually, disliking a whole style based on one item is harsh. 
                // But the user requested "doing like dislikes of 7 8 products... weightage sent".
                // So we add these tags to dislikes.
                const newDislikes = [...new Set([...preferences.dislikes, ...tagsToCheck])];
                if (newDislikes.length > preferences.dislikes.length) {
                    setDislikes(newDislikes);
                }
            }

            // 5. Check Sync Threshold
            interactionCount.current += 1;
            if (interactionCount.current % INTERACTION_SYNC_THRESHOLD === 0) {
                console.log('[ProductFeed] Syncing preferences and refreshing recommendations (Dislike trig)...');
                await savePreferences();
                try {
                    const res = await API.products.getRecommendations();
                    const recs = (res.data || []).map(convertToAppProduct);
                    if (recs.length > 0) {
                        setAllProducts(prev => {
                            const existingIds = new Set(prev.map((p: Product) => p.id));
                            const unique = recs.filter((p: Product) => !existingIds.has(p.id));
                            return [...prev, ...unique];
                        });
                    }
                } catch (e) {
                    console.warn('Failed to refresh recs', e);
                }
            }

        } catch (err) {
            console.warn('[ProductFeed] Failed to record DISLIKE interaction:', err);
        }
    }, [preferences, setDislikes, savePreferences, fetchProducts, currentPage]);

    // --------------------------------------------------------------------------
    // Feed management
    // --------------------------------------------------------------------------
    const refreshFeed = useCallback(async () => {
        setCurrentPage(1);
        setHasMore(true);
        await fetchProducts(1, true);
    }, [fetchProducts]);

    const resetFeed = useCallback(async () => {
        // Clear all swiped/liked data
        setSwipedProductIds(new Set());
        setLikedProductIds([]);
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.SWIPED_PRODUCT_IDS,
            STORAGE_KEYS.LIKED_PRODUCT_IDS,
        ]);

        // Reload products
        await refreshFeed();
    }, [refreshFeed]);

    // --------------------------------------------------------------------------
    // Liked products management
    // --------------------------------------------------------------------------
    const getLikedProducts = useCallback((): Product[] => {
        return allProducts.filter(p => likedProductIds.includes(p.id));
    }, [allProducts, likedProductIds]);

    const removeFromLiked = useCallback(async (productId: string) => {
        setLikedProductIds(prev => {
            const filtered = prev.filter(id => id !== productId);
            AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCT_IDS, JSON.stringify(filtered));
            return filtered;
        });
    }, []);

    // --------------------------------------------------------------------------
    // Get product by ID (for detail page)
    // --------------------------------------------------------------------------
    const getProductById = useCallback((id: string | number): Product | undefined => {
        const stringId = String(id);
        return allProducts.find(p => p.id === stringId || String(p.id) === stringId);
    }, [allProducts]);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------
    return (
        <ProductFeedContext.Provider
            value={{
                products,
                currentIndex,
                isLoading,
                isPreFetching,
                hasMore,
                error,
                currentProduct,
                nextProduct,
                remainingCount,
                handleSwipeRight,
                handleSwipeLeft,
                refreshFeed,
                resetFeed,
                likedProductIds,
                getLikedProducts,
                removeFromLiked,
                getProductById,
            }}
        >
            {children}
        </ProductFeedContext.Provider>
    );
}
