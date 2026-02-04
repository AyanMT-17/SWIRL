import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Collection } from '@/types/app';

interface CollectionsContextType {
    collections: Collection[];
    createCollection: (name: string, firstProduct: any) => Promise<void>;
    addToCollection: (collectionId: string, productId: string) => Promise<void>;
    removeCollection: (collectionId: string) => Promise<void>;
    isLoading: boolean;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const STORAGE_KEY = user ? `@swirl_collections_${user.id}` : null;

    useEffect(() => {
        if (STORAGE_KEY) {
            loadCollections();
        } else {
            setCollections([]);
            setIsLoading(false);
        }
    }, [STORAGE_KEY]);

    const loadCollections = async () => {
        if (!STORAGE_KEY) return;
        setIsLoading(true);
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                setCollections(JSON.parse(data));
            } else {
                setCollections([]);
            }
        } catch (error) {
            console.error('[Collections] Failed to load:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCollections = async (newCollections: Collection[]) => {
        if (!STORAGE_KEY) return;
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCollections));
            setCollections(newCollections);
        } catch (error) {
            console.error('[Collections] Failed to save:', error);
        }
    };

    const createCollection = async (name: string, firstProduct: any) => {
        const newCollection: Collection = {
            id: Date.now().toString(),
            name,
            image: firstProduct.product_images?.[0]?.image_url || '',
            productIds: [firstProduct.id],
        };
        await saveCollections([...collections, newCollection]);
    };

    const addToCollection = async (collectionId: string, productId: string) => {
        const updatedCollections = collections.map(col => {
            if (col.id === collectionId && !col.productIds.includes(productId)) {
                return { ...col, productIds: [...col.productIds, productId] };
            }
            return col;
        });
        await saveCollections(updatedCollections);
    };

    const removeCollection = async (collectionId: string) => {
        const updatedCollections = collections.filter(col => col.id !== collectionId);
        await saveCollections(updatedCollections);
    };

    return (
        <CollectionsContext.Provider value={{ collections, createCollection, addToCollection, removeCollection, isLoading }}>
            {children}
        </CollectionsContext.Provider>
    );
}

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    if (context === undefined) {
        throw new Error('useCollections must be used within a CollectionsProvider');
    }
    return context;
};
