import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Re-use Product type from CartContext or define here
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
    isLoading: boolean;
}

const STORAGE_KEY = 'swirl_likes';

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: React.ReactNode }) {
    const [likedProducts, setLikedProducts] = useState<Product[]>([]);
    const [skippedProductIds, setSkippedProductIds] = useState<string[]>([]);
    const [interactions, setInteractions] = useState<ProductInteraction[]>([]);
    const [lastAction, setLastAction] = useState<{ type: 'like' | 'skip'; product: Product } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: LikesData = JSON.parse(stored);
                setLikedProducts(data.likedProducts || []);
                setSkippedProductIds(data.skippedProductIds || []);
                setInteractions(data.interactions || []);
            }
        } catch (error) {
            console.error('Failed to load likes data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async (data: LikesData) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save likes data:', error);
        }
    };

    const likeProduct = useCallback(async (product: Product) => {
        // Skip if already liked
        if (likedProducts.some(p => p.id === product.id)) return;

        const newInteraction: ProductInteraction = {
            productId: product.id,
            action: 'like',
            timestamp: Date.now(),
            category: product.category,
        };

        const newLikedProducts = [...likedProducts, product];
        // Remove from skipped if it was there
        const newSkippedIds = skippedProductIds.filter(id => id !== product.id);
        const newInteractions = [...interactions, newInteraction];

        setLikedProducts(newLikedProducts);
        setSkippedProductIds(newSkippedIds);
        setInteractions(newInteractions);
        setLastAction({ type: 'like', product });

        await saveData({
            likedProducts: newLikedProducts,
            skippedProductIds: newSkippedIds,
            interactions: newInteractions,
        });
    }, [likedProducts, skippedProductIds, interactions]);

    const skipProduct = useCallback(async (product: Product) => {
        // Skip if already skipped
        if (skippedProductIds.includes(product.id)) return;

        const newInteraction: ProductInteraction = {
            productId: product.id,
            action: 'skip',
            timestamp: Date.now(),
            category: product.category,
        };

        const newSkippedIds = [...skippedProductIds, product.id];
        const newInteractions = [...interactions, newInteraction];

        setSkippedProductIds(newSkippedIds);
        setInteractions(newInteractions);
        setLastAction({ type: 'skip', product });

        await saveData({
            likedProducts,
            skippedProductIds: newSkippedIds,
            interactions: newInteractions,
        });
    }, [likedProducts, skippedProductIds, interactions]);

    const removeFromLikes = useCallback(async (productId: string) => {
        const newLikedProducts = likedProducts.filter(p => p.id !== productId);
        setLikedProducts(newLikedProducts);

        await saveData({
            likedProducts: newLikedProducts,
            skippedProductIds,
            interactions,
        });
    }, [likedProducts, skippedProductIds, interactions]);

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
            // Remove from likes
            const newLikedProducts = likedProducts.filter(p => p.id !== product.id);
            // Remove last interaction
            const newInteractions = interactions.slice(0, -1);

            setLikedProducts(newLikedProducts);
            setInteractions(newInteractions);
            setLastAction(null);

            await saveData({
                likedProducts: newLikedProducts,
                skippedProductIds,
                interactions: newInteractions,
            });
        } else if (type === 'skip') {
            // Remove from skipped
            const newSkippedIds = skippedProductIds.filter(id => id !== product.id);
            // Remove last interaction
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
    }, [lastAction, likedProducts, skippedProductIds, interactions]);

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
                resetAll: async () => {
                    setLikedProducts([]);
                    setSkippedProductIds([]);
                    setInteractions([]);
                    setLastAction(null);
                    await saveData({
                        likedProducts: [],
                        skippedProductIds: [],
                        interactions: [],
                    });
                },
                isLoading,
            }}
        >
            {children}
        </LikesContext.Provider>
    );
}

export function useLikes() {
    const context = useContext(LikesContext);
    if (context === undefined) {
        throw new Error('useLikes must be used within a LikesProvider');
    }
    return context;
}
