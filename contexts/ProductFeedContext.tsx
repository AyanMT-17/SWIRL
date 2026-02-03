import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, getAuthToken, getStoredUser } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
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
    LIKED_PRODUCTS_FULL: '@swirl_liked_products_full',
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

        // If it's already a clean URL (http/https) and doesn't look like a template, return it
        if ((url.startsWith('http') || url.startsWith('https')) && !url.includes('($')) {
            return url;
        }

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
        id: String(backendProduct.item_id || backendProduct._id || Math.random().toString()),
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
    const { isAuthenticated } = useAuth();
    const { isOnboardingComplete, preferences, setLikes, setDislikes, savePreferences } = useUserPreferences();

    // State
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [swipedProductIds, setSwipedProductIds] = useState<Set<string>>(new Set());
    const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
    const [likedProductsFull, setLikedProductsFull] = useState<Product[]>([]);
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
                const [swipedStr, likedStr, likedFullStr] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.SWIPED_PRODUCT_IDS),
                    AsyncStorage.getItem(STORAGE_KEYS.LIKED_PRODUCT_IDS),
                    AsyncStorage.getItem(STORAGE_KEYS.LIKED_PRODUCTS_FULL),
                ]);

                if (swipedStr) setSwipedProductIds(new Set(JSON.parse(swipedStr)));
                if (likedStr) setLikedProductIds(JSON.parse(likedStr));
                if (likedFullStr) setLikedProductsFull(JSON.parse(likedFullStr));
            } catch (err) {
                console.error('[ProductFeed] Error loading persisted data:', err);
            }
        };

        loadPersistedData();
    }, []);

    // --------------------------------------------------------------------------
    // Fetch products from backend (products.json is the PRIMARY data source)
    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Deck of Cards Logic
    // --------------------------------------------------------------------------

    // Parallel fetch helper
    const fetchCategoryBatch = async (category: string | undefined, limit: number, gender: string) => {
        try {
            // If category is 'All' or undefined, don't filter by category
            const filters: any = { gender };
            if (category && category !== 'All') {
                filters.category = category;
            }

            const res = await API.products.getAll(1, limit, filters);
            return (res.data?.data || []).map(convertToAppProduct);
        } catch (e) {
            console.warn(`[ProductFeed] Failed to fetch batch for ${category}:`, e);
            return [];
        }
    };

    const fetchDiverseBatch = async (gender: string, count: number) => {
        try {
            // Parallel fetching for infinite deck variety using WEIGHTED recommendations
            // We fetch specific counts for each category as requested

            // If we have local preferences, send them to the backend to ensure immediate consistency
            const getRecs = (cat: string) => {
                if (preferences) {
                    return API.products.getRecommendationsWithPrefs(preferences, cat, count);
                }
                return API.products.getRecommendations(cat, count);
            };

            const topPromise = getRecs('Top')
                .then(r => (r.data || []).map(convertToAppProduct))
                .catch(() => []);

            const botPromise = getRecs('Bottom')
                .then(r => (r.data || []).map(convertToAppProduct))
                .catch(() => []);

            const footPromise = getRecs('Footwear')
                .then(r => (r.data || []).map(convertToAppProduct))
                .catch(() => []);

            const [tops, bots, feet] = await Promise.all([
                topPromise, botPromise, footPromise
            ]);

            // Interleave Strategy
            const deck: Product[] = [];
            const addedIds = new Set<string>();
            const maxLen = Math.max(tops.length, bots.length, feet.length);

            for (let i = 0; i < maxLen; i++) {
                if (tops[i] && !addedIds.has(tops[i].id)) {
                    deck.push(tops[i]);
                    addedIds.add(tops[i].id);
                }
                if (bots[i] && !addedIds.has(bots[i].id)) {
                    deck.push(bots[i]);
                    addedIds.add(bots[i].id);
                }
                if (feet[i] && !addedIds.has(feet[i].id)) {
                    deck.push(feet[i]);
                    addedIds.add(feet[i].id);
                }
            }
            return deck;
        } catch (err) {
            console.error('[ProductFeed] Error in diverse fetch:', err);
            return [];
        }
    };

    const fetchProducts = useCallback(async (isInitial: boolean = false) => {
        // 1. Guard: Don't fetch if not authenticated
        if (!isAuthenticated) {
            console.log('[ProductFeed] 🛑 Fetch aborted: User not authenticated');
            setIsLoading(false);
            setIsPreFetching(false);
            return;
        }

        if (isInitial) {
            setIsLoading(true);
            setAllProducts([]);
        } else {
            setIsPreFetching(true);
        }
        setError(null);

        try {
            const userGender = preferences?.gender || 'Men';

            if (isInitial) {
                console.log(`[ProductFeed] 🚀 Initial Deck Load for ${userGender}...`);
            } else {
                console.log(`[ProductFeed] 🔄 Appending to Deck for ${userGender}...`);
            }

            // Unified Fetch Strategy
            const count = isInitial ? 20 : 10;
            const newProducts = await fetchDiverseBatch(userGender, count);

            setAllProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                // Filter out duplicates
                const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));

                // Debug categories to understand why Top/Foot might be missing
                if (uniqueNew.length > 0) {
                    uniqueNew.forEach((p, idx) => {
                        if (idx < 5) console.log(`[ProductFeed] Loaded: ${p.name} | Cat: ${p.category} | RealCat: ${p.properties.category}`);
                    });
                }

                if (uniqueNew.length === 0) {
                    // console.log('[ProductFeed] ⚠️ No new unique products found. Stopping fetch.');
                    setHasMore(false);
                    return prev;
                }

                console.log(`[ProductFeed] + Added ${uniqueNew.length} cards to deck.`);
                setHasMore(true);
                return [...prev, ...uniqueNew];
            });

        } catch (err: any) {
            console.error('[ProductFeed] Fetch error:', err);
            setError(err.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
            setIsPreFetching(false);
            if (isInitial) initialLoadDone.current = true;
        }
    }, [isAuthenticated, isOnboardingComplete, preferences?.gender, preferences?.likes]);

    // Initial load - ONLY fetch after onboarding is complete
    useEffect(() => {
        const checkReadyAndFetch = async () => {
            // 1. Wait for context states to be ready
            if (!isOnboardingComplete || !isAuthenticated) {
                console.log('[ProductFeed] Waiting for onboarding/auth context before fetching...');
                setIsLoading(false);
                return;
            }

            // 2. Double check local storage (failsafe for redirection edge cases)
            const token = await getAuthToken();
            const user = await getStoredUser();

            if (!token || !user) {
                console.log('[ProductFeed] Onboarding context says complete, but storage is empty. Aborting fetch.');
                return;
            }

            // 3. Trigger fetch if not already done
            if (!initialLoadDone.current) {
                initialLoadDone.current = true;
                console.log('[ProductFeed] All guards passed, fetching initial products...');
                fetchProducts(true);
            }
        };

        checkReadyAndFetch();
    }, [isOnboardingComplete, isAuthenticated, fetchProducts]);

    // Cleanup on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setAllProducts([]);
            setCurrentPage(1);
            setHasMore(true);
            setIsLoading(false);
            setIsPreFetching(false);
            initialLoadDone.current = false;
        }
    }, [isAuthenticated]);

    // Handle Preference Changes (Reset Deck if Gender shifts)
    const lastGender = useRef(preferences?.gender);
    useEffect(() => {
        if (preferences?.gender && preferences.gender !== lastGender.current) {
            console.log(`[ProductFeed] Gender changed from ${lastGender.current} to ${preferences.gender}. Resetting deck...`);
            lastGender.current = preferences.gender;

            // Critical Reset
            initialLoadDone.current = false;
            setAllProducts([]);
            setCurrentPage(1);
            setHasMore(true);

            // The initial load effect will pick this up and trigger fetchProducts(true)
        }
    }, [preferences?.gender]);

    // --------------------------------------------------------------------------
    // Pre-fetch trigger
    // --------------------------------------------------------------------------
    useEffect(() => {
        // Stop if not authenticated
        if (!isAuthenticated) return;

        // Stop if there's an error (prevent infinite retry loop)
        if (error) return;

        // When remaining products drop below threshold, pre-fetch
        // When remaining products drop below threshold (e.g. 10), AND we've swiped enough (e.g. 8) OR just low buffer
        // New Logic: Every 8 swipes OR low buffer
        if (remainingCount <= PREFETCH_THRESHOLD && !isPreFetching && !isLoading && hasMore) {
            console.log(`[ProductFeed] Buffer Low (${remainingCount}) - Triggering Deck Append...`);
            fetchProducts(false);
        }
    }, [remainingCount, hasMore, isPreFetching, isLoading, currentPage, fetchProducts, isAuthenticated, error]);

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

        setLikedProductsFull(prev => {
            if (!prev.find(p => p.id === productId)) {
                const newLikedFull = [...prev, product];
                AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCTS_FULL, JSON.stringify(newLikedFull));
                return newLikedFull;
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
                // Trigger append update (count = 10)
                fetchProducts(false);
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
                // Trigger append update (count = 10)
                fetchProducts(false);
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
        await fetchProducts(true);
    }, [fetchProducts]);

    const resetFeed = useCallback(async () => {
        // Clear all swiped/liked data
        setSwipedProductIds(new Set());
        setLikedProductIds([]);
        setLikedProductsFull([]);
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.SWIPED_PRODUCT_IDS,
            STORAGE_KEYS.LIKED_PRODUCT_IDS,
            STORAGE_KEYS.LIKED_PRODUCTS_FULL,
        ]);

        // Reload products
        await refreshFeed();
    }, [refreshFeed]);

    // --------------------------------------------------------------------------
    // Liked products management
    // --------------------------------------------------------------------------
    const getLikedProducts = useCallback((): Product[] => {
        return likedProductsFull;
    }, [likedProductsFull]);

    const removeFromLiked = useCallback(async (productId: string) => {
        setLikedProductIds(prev => {
            const filtered = prev.filter(id => id !== productId);
            AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCT_IDS, JSON.stringify(filtered));
            return filtered;
        });
        setLikedProductsFull(prev => {
            const filtered = prev.filter(p => p.id !== productId);
            AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCTS_FULL, JSON.stringify(filtered));
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
