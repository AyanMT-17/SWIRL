import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductProperties, MOCK_PRODUCTS } from '@/constants/mockData';

// Storage Keys
const STORAGE_KEYS = {
    WEIGHTAGES: '@swirl_weightages',
    LIKED_PRODUCTS: '@swirl_liked_products',
    COLLECTIONS: '@swirl_collections',
    DISLIKED_PRODUCTS: '@swirl_disliked_products' // To avoid showing again
};

// Types
type WeightageMap = {
    [key in keyof ProductProperties]?: {
        [value: string]: number;
    };
};

export interface Collection {
    id: string;
    name: string;
    image: string; // URL of first product
    productIds: string[];
}

interface RecommendationContextType {
    userWeightages: WeightageMap;
    likedProductIds: string[];
    dislikedProductIds: string[];
    collections: Collection[];
    handleSwipeRight: (product: Product) => Promise<void>;
    handleSwipeLeft: (product: Product) => Promise<void>;
    createCollection: (name: string, initialProduct: Product) => Promise<void>;
    addToCollection: (collectionId: string, productId: string) => Promise<void>;
    resetData: () => Promise<void>;
    isLoading: boolean;
    getRecommendedProducts: () => Product[]; // Returns sorted products
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export function RecommendationProvider({ children }: { children: React.ReactNode }) {
    const [userWeightages, setUserWeightages] = useState<WeightageMap>({});
    const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
    const [dislikedProductIds, setDislikedProductIds] = useState<string[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const [weightagesStr, likedStr, dislikedStr, collectionsStr] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.WEIGHTAGES),
                AsyncStorage.getItem(STORAGE_KEYS.LIKED_PRODUCTS),
                AsyncStorage.getItem(STORAGE_KEYS.DISLIKED_PRODUCTS),
                AsyncStorage.getItem(STORAGE_KEYS.COLLECTIONS),
            ]);

            if (weightagesStr) setUserWeightages(JSON.parse(weightagesStr));
            if (likedStr) setLikedProductIds(JSON.parse(likedStr));
            if (dislikedStr) setDislikedProductIds(JSON.parse(dislikedStr));
            if (collectionsStr) setCollections(JSON.parse(collectionsStr));
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateWeightage = (properties: ProductProperties, change: number) => {
        const newWeightages = { ...userWeightages };

        // Iterate over each property of the product (e.g., style: 'streetwear')
        (Object.keys(properties) as Array<keyof ProductProperties>).forEach((key) => {
            const value = properties[key];
            if (!newWeightages[key]) {
                newWeightages[key] = {};
            }
            // Initialize if undefined
            if (newWeightages[key]![value] === undefined) {
                newWeightages[key]![value] = 0;
            }
            // Apply change (+1 or -1)
            newWeightages[key]![value] += change;
        });

        setUserWeightages(newWeightages);
        saveWeightages(newWeightages);
    };

    const saveWeightages = async (weightages: WeightageMap) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTAGES, JSON.stringify(weightages));
        } catch (error) {
            console.error('Error saving weightages:', error);
        }
    };

    // SWIPE RIGHT (LIKE)
    const handleSwipeRight = async (product: Product) => {
        // 1. Add to Liked Products
        if (!likedProductIds.includes(product.id)) {
            const newLiked = [...likedProductIds, product.id];
            setLikedProductIds(newLiked);
            AsyncStorage.setItem(STORAGE_KEYS.LIKED_PRODUCTS, JSON.stringify(newLiked));
        }

        // 2. Update Weightages (+1)
        updateWeightage(product.properties, 1);
    };

    // SWIPE LEFT (DISLIKE)
    const handleSwipeLeft = async (product: Product) => {
        // 1. Add to Disliked Products (so we don't show it again ideally)
        if (!dislikedProductIds.includes(product.id)) {
            const newDisliked = [...dislikedProductIds, product.id];
            setDislikedProductIds(newDisliked);
            AsyncStorage.setItem(STORAGE_KEYS.DISLIKED_PRODUCTS, JSON.stringify(newDisliked));
        }

        // 2. Update Weightages (-1)
        updateWeightage(product.properties, -1);
    };

    // COLLECTION MANAGEMENT
    const createCollection = async (name: string, initialProduct: Product) => {
        const newCollection: Collection = {
            id: Date.now().toString(),
            name,
            image: initialProduct.product_images[0].image_url,
            productIds: [initialProduct.id]
        };
        const newCollections = [...collections, newCollection];
        setCollections(newCollections);
        await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(newCollections));
    };

    const addToCollection = async (collectionId: string, productId: string) => {
        const newCollections = collections.map(col => {
            if (col.id === collectionId && !col.productIds.includes(productId)) {
                return { ...col, productIds: [...col.productIds, productId] };
            }
            return col;
        });
        setCollections(newCollections);
        await AsyncStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(newCollections));
    };

    const resetData = async () => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.WEIGHTAGES,
                STORAGE_KEYS.LIKED_PRODUCTS,
                STORAGE_KEYS.DISLIKED_PRODUCTS,
                STORAGE_KEYS.COLLECTIONS
            ]);
            setUserWeightages({});
            setLikedProductIds([]);
            setDislikedProductIds([]);
            setCollections([]);
        } catch (error) {
            console.error('Error resetting data:', error);
        }
    };

    // RECOMMENDATION ENGINE (Simple sorting)
    const getRecommendedProducts = (): Product[] => {
        // Filter out already swiped products
        const candidates = MOCK_PRODUCTS.filter(p => !likedProductIds.includes(p.id) && !dislikedProductIds.includes(p.id));

        // Score each candidate
        const scoredCandidates = candidates.map(product => {
            let score = 0;
            (Object.keys(product.properties) as Array<keyof ProductProperties>).forEach(key => {
                const val = product.properties[key];
                const weight = userWeightages[key]?.[val] || 0;
                score += weight;
            });
            return { product, score };
        });

        // Sort by score descending
        return scoredCandidates.sort((a, b) => b.score - a.score).map(item => item.product);
    };

    return (
        <RecommendationContext.Provider value={{
            userWeightages,
            likedProductIds,
            dislikedProductIds,
            collections,
            handleSwipeRight,
            handleSwipeLeft,
            createCollection,
            addToCollection,
            resetData,
            isLoading,
            getRecommendedProducts
        }}>
            {children}
        </RecommendationContext.Provider>
    );
}

export function useRecommendation() {
    const context = useContext(RecommendationContext);
    if (context === undefined) {
        throw new Error('useRecommendation must be used within a RecommendationProvider');
    }
    return context;
}
