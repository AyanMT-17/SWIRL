import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// Types
// ============================================================================

export interface Product {
    id: string;
    name: string;
    price: number;
    brand: string;
    category: string;
    product_images: { image_url: string }[];
    description?: string;
    original_price?: number | null;
    discount_percentage?: number | null;
    categories?: string[];
}

export interface ProductInteraction {
    productId: string;
    action: 'like' | 'skip' | 'view' | 'cart';
    timestamp: number;
    category: string;
}

interface LikesData {
    likedProducts: Product[];
    skippedProductIds: string[];
    interactions: ProductInteraction[];
}

// Backend wishlist item structure
interface BackendWishlistItem {
    id: string;
    itemId: number;
    product?: {
        id: number;
        name: string;
        price: number;
        brand: string;
        image_url: string;
        category: string;
    };
}

interface LikesContextType {
    likedProducts: Product[];
    skippedProductIds: string[];
    likeProduct: (product: Product) => Promise<void>;
    skipProduct: (product: Product) => Promise<void>;
    removeFromLikes: (productId: string) => Promise<void>;
    isProductLiked: (productId: string) => boolean;
    isProductSkipped: (productId: string) => boolean;
    recordInteraction: (product: Product, action: 'view' | 'cart') => Promise<void>;
    getInteractions: () => ProductInteraction[];
    clearInteractions: () => Promise<void>;
    undoLastAction: () => Promise<Product | null>;
    resetAll: () => Promise<void>;
    syncWithBackend: () => Promise<void>;
    isLoading: boolean;
    isSyncing: boolean;
}

const STORAGE_KEY = '@swirl_likes';

const LikesContext = createContext<LikesContextType | undefined>(undefined);

// ============================================================================
// Helper: Convert backend wishlist item to Product
// ============================================================================

const convertWishlistItem = (item: BackendWishlistItem): Product | null => {
    if (!item.product) return null;

    return {
        id: String(item.product.id),
        name: item.product.name,
        price: item.product.price,
        brand: item.product.brand,
        category: item.product.category || 'Unknown',
        product_images: [{ image_url: item.product.image_url }],
    };
};

// ============================================================================
// Provider
// ============================================================================

export function LikesProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [likedProducts, setLikedProducts] = useState<Product[]>([]);
    const [skippedProductIds, setSkippedProductIds] = useState<string[]>([]);
    const [interactions, setInteractions] = useState<ProductInteraction[]>([]);
    const [lastAction, setLastAction] = useState<{ type: 'like' | 'skip'; product: Product } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // --------------------------------------------------------------------------
    // Load data on mount
    // --------------------------------------------------------------------------
    useEffect(() => {
        loadData();
    }, [isAuthenticated]);

    const loadData = async () => {
        setIsLoading(true);

        try {
            // 1. Load from local storage first (fast)
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: LikesData = JSON.parse(stored);
                setLikedProducts(data.likedProducts || []);
                setSkippedProductIds(data.skippedProductIds || []);
                setInteractions(data.interactions || []);
                console.log('[Likes] Loaded from local storage');
            }

            // 2. If authenticated, sync with backend wishlist
            if (isAuthenticated) {
                try {
                    const response = await API.wishlist.get();
                    const backendItems = (response.data || []) as BackendWishlistItem[];
                    const products = backendItems
                        .map(convertWishlistItem)
                        .filter((p): p is Product => p !== null);

                    if (products.length > 0) {
                        setLikedProducts(products);
                        console.log(`[Likes] Synced ${products.length} items from backend wishlist`);
                    }
                } catch (apiError: any) {
                    console.warn('[Likes] Backend sync failed:', apiError.message);
                    // Keep using local data
                }
            }
        } catch (error) {
            console.error('[Likes] Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --------------------------------------------------------------------------
    // Save data to local storage
    // --------------------------------------------------------------------------
    const saveData = async (data: LikesData) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('[Likes] Failed to save data:', error);
        }
    };

    // --------------------------------------------------------------------------
    // Sync with backend
    // --------------------------------------------------------------------------
    const syncWithBackend = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsSyncing(true);
        try {
            const response = await API.wishlist.get();
            const backendItems = (response.data || []) as BackendWishlistItem[];
            const products = backendItems
                .map(convertWishlistItem)
                .filter((p): p is Product => p !== null);

            setLikedProducts(products);
            await saveData({
                likedProducts: products,
                skippedProductIds,
                interactions,
            });
            console.log('[Likes] Synced with backend');
        } catch (error) {
            console.error('[Likes] Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [isAuthenticated, skippedProductIds, interactions]);

    // --------------------------------------------------------------------------
    // Like product - Optimistic UI + Backend sync
    // --------------------------------------------------------------------------
    const likeProduct = useCallback(async (product: Product) => {
        // Skip if already liked
        if (likedProducts.some(p => p.id === product.id)) return;

        const newInteraction: ProductInteraction = {
            productId: product.id,
            action: 'like',
            timestamp: Date.now(),
            category: product.category,
        };

        // 1. Optimistic update
        const newLikedProducts = [...likedProducts, product];
        const newSkippedIds = skippedProductIds.filter(id => id !== product.id);
        const newInteractions = [...interactions, newInteraction];

        setLikedProducts(newLikedProducts);
        setSkippedProductIds(newSkippedIds);
        setInteractions(newInteractions);
        setLastAction({ type: 'like', product });

        // 2. Save locally
        await saveData({
            likedProducts: newLikedProducts,
            skippedProductIds: newSkippedIds,
            interactions: newInteractions,
        });

        // 3. Sync with backend wishlist if authenticated
        if (isAuthenticated) {
            try {
                await API.wishlist.add(parseInt(product.id) || 0);
                console.log('[Likes] Added to backend wishlist');
            } catch (error) {
                console.warn('[Likes] Backend add failed:', error);
            }
        }

        // 4. Record interaction for ML
        try {
            await API.interactions.record('WISHLIST_ADD', parseInt(product.id) || 0);
        } catch (error) {
            console.warn('[Likes] Failed to record WISHLIST_ADD interaction:', error);
        }
    }, [likedProducts, skippedProductIds, interactions, isAuthenticated]);

    // --------------------------------------------------------------------------
    // Skip product - Record interaction
    // --------------------------------------------------------------------------
    const skipProduct = useCallback(async (product: Product) => {
        // Skip if already skipped
        if (skippedProductIds.includes(product.id)) return;

        const newInteraction: ProductInteraction = {
            productId: product.id,
            action: 'skip',
            timestamp: Date.now(),
            category: product.category,
        };

        // 1. Update state
        const newSkippedIds = [...skippedProductIds, product.id];
        const newInteractions = [...interactions, newInteraction];

        setSkippedProductIds(newSkippedIds);
        setInteractions(newInteractions);
        setLastAction({ type: 'skip', product });

        // 2. Save locally
        await saveData({
            likedProducts,
            skippedProductIds: newSkippedIds,
            interactions: newInteractions,
        });

        // 3. Record interaction for ML
        try {
            await API.interactions.record('DISLIKE', parseInt(product.id) || 0);
        } catch (error) {
            console.warn('[Likes] Failed to record DISLIKE interaction:', error);
        }
    }, [likedProducts, skippedProductIds, interactions]);

    // --------------------------------------------------------------------------
    // Remove from likes - Optimistic UI + Backend sync
    // --------------------------------------------------------------------------
    const removeFromLikes = useCallback(async (productId: string) => {
        // 1. Optimistic update
        const newLikedProducts = likedProducts.filter(p => p.id !== productId);
        setLikedProducts(newLikedProducts);

        // 2. Save locally
        await saveData({
            likedProducts: newLikedProducts,
            skippedProductIds,
            interactions,
        });

        // 3. Sync with backend if authenticated
        if (isAuthenticated) {
            try {
                await API.wishlist.remove(productId);
                console.log('[Likes] Removed from backend wishlist');
            } catch (error) {
                console.warn('[Likes] Backend remove failed:', error);
            }
        }

        // 4. Record interaction for ML
        try {
            await API.interactions.record('WISHLIST_REMOVE', parseInt(productId) || 0);
        } catch (error) {
            console.warn('[Likes] Failed to record WISHLIST_REMOVE interaction:', error);
        }
    }, [likedProducts, skippedProductIds, interactions, isAuthenticated]);

    // --------------------------------------------------------------------------
    // Helper functions
    // --------------------------------------------------------------------------
    const isProductLiked = useCallback((productId: string) => {
        return likedProducts.some(p => p.id === productId);
    }, [likedProducts]);

    const isProductSkipped = useCallback((productId: string) => {
        return skippedProductIds.includes(productId);
    }, [skippedProductIds]);

    const recordInteraction = useCallback(async (product: Product, action: 'view' | 'cart') => {
        const newInteraction: ProductInteraction = {
            productId: product.id,
            action,
            timestamp: Date.now(),
            category: product.category,
        };

        const newInteractions = [...interactions, newInteraction];
        setInteractions(newInteractions);

        await saveData({
            likedProducts,
            skippedProductIds,
            interactions: newInteractions,
        });

        // Record to backend
        try {
            const interactionType = action === 'view' ? 'VIEW' : 'CART_ADD';
            await API.interactions.record(interactionType as any, parseInt(product.id) || 0);
        } catch (error) {
            console.warn(`[Likes] Failed to record ${action} interaction:`, error);
        }
    }, [likedProducts, skippedProductIds, interactions]);

    const getInteractions = useCallback(() => {
        return interactions;
    }, [interactions]);

    const clearInteractions = useCallback(async () => {
        setInteractions([]);
        await saveData({
            likedProducts,
            skippedProductIds,
            interactions: [],
        });
    }, [likedProducts, skippedProductIds]);

    const undoLastAction = useCallback(async (): Promise<Product | null> => {
        if (!lastAction) return null;

        const { type, product } = lastAction;

        if (type === 'like') {
            const newLikedProducts = likedProducts.filter(p => p.id !== product.id);
            const newInteractions = interactions.slice(0, -1);

            setLikedProducts(newLikedProducts);
            setInteractions(newInteractions);
            setLastAction(null);

            await saveData({
                likedProducts: newLikedProducts,
                skippedProductIds,
                interactions: newInteractions,
            });

            // Remove from backend wishlist
            if (isAuthenticated) {
                try {
                    await API.wishlist.remove(product.id);
                } catch (error) {
                    console.warn('[Likes] Backend undo remove failed:', error);
                }
            }
        } else if (type === 'skip') {
            const newSkippedIds = skippedProductIds.filter(id => id !== product.id);
            const newInteractions = interactions.slice(0, -1);

            setSkippedProductIds(newSkippedIds);
            setInteractions(newInteractions);
            setLastAction(null);

            await saveData({
                likedProducts,
                skippedProductIds: newSkippedIds,
                interactions: newInteractions,
            });
        }

        return product;
    }, [lastAction, likedProducts, skippedProductIds, interactions, isAuthenticated]);

    const resetAll = useCallback(async () => {
        setLikedProducts([]);
        setSkippedProductIds([]);
        setInteractions([]);
        setLastAction(null);

        await saveData({
            likedProducts: [],
            skippedProductIds: [],
            interactions: [],
        });
    }, []);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------
    return (
        <LikesContext.Provider
            value={{
                likedProducts,
                skippedProductIds,
                likeProduct,
                skipProduct,
                removeFromLikes,
                isProductLiked,
                isProductSkipped,
                recordInteraction,
                getInteractions,
                clearInteractions,
                undoLastAction,
                resetAll,
                syncWithBackend,
                isLoading,
                isSyncing,
            }}
        >
            {children}
        </LikesContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useLikes() {
    const context = useContext(LikesContext);
    if (context === undefined) {
        throw new Error('useLikes must be used within a LikesProvider');
    }
    return context;
}
