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
    product_images: { image_url: string }[];
}

export interface CartItem {
    id: string; // Unique ID for the cart entry (backend ID or local timestamp)
    productId: string;
    size: string;
    quantity: number;
    product: Product; // Embed product details for easier display
}

// Backend cart item structure
interface BackendCartItem {
    id: string;
    itemId: number;
    quantity: number;
    size?: string;
    product?: {
        id: number;
        name: string;
        price: number;
        brand: string;
        image_url: string;
    };
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, size: string, quantity?: number) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    getCartCount: () => number;
    isLoading: boolean;
    isSyncing: boolean;
    syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key
const CART_STORAGE_KEY = '@swirl_cart';

// ============================================================================
// Helper: Convert backend cart item to app format
// ============================================================================

const convertBackendCartItem = (backendItem: BackendCartItem): CartItem => ({
    id: String(backendItem.id),
    productId: String(backendItem.itemId),
    size: backendItem.size || 'M',
    quantity: backendItem.quantity,
    product: backendItem.product ? {
        id: String(backendItem.product.id),
        name: backendItem.product.name,
        price: backendItem.product.price,
        brand: backendItem.product.brand,
        product_images: [{ image_url: backendItem.product.image_url }],
    } : {
        id: String(backendItem.itemId),
        name: 'Unknown Product',
        price: 0,
        brand: 'Unknown',
        product_images: [],
    },
});

// ============================================================================
// Provider
// ============================================================================

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // --------------------------------------------------------------------------
    // Load cart on mount
    // --------------------------------------------------------------------------
    useEffect(() => {
        loadCart();
    }, [isAuthenticated]);

    const loadCart = async () => {
        setIsLoading(true);

        try {
            // 1. Load from local storage first (fast)
            const localCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (localCart) {
                setCartItems(JSON.parse(localCart));
                console.log('[Cart] Loaded from local storage');
            }

            // 2. If authenticated, sync with backend
            if (isAuthenticated) {
                try {
                    const response = await API.cart.get();
                    const backendItems = (response.data || []) as BackendCartItem[];
                    const convertedItems = backendItems.map(convertBackendCartItem);

                    setCartItems(convertedItems);
                    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(convertedItems));
                    console.log(`[Cart] Synced ${convertedItems.length} items from backend`);
                } catch (apiError: any) {
                    console.warn('[Cart] Backend sync failed:', apiError.message);
                    // Keep using local data
                }
            }
        } catch (error) {
            console.error('[Cart] Failed to load cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --------------------------------------------------------------------------
    // Save cart to local storage
    // --------------------------------------------------------------------------
    const saveCartLocal = async (items: CartItem[]) => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('[Cart] Failed to save cart locally:', error);
        }
    };

    // --------------------------------------------------------------------------
    // Sync cart with backend
    // --------------------------------------------------------------------------
    const syncCart = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsSyncing(true);
        try {
            const response = await API.cart.get();
            const backendItems = (response.data || []) as BackendCartItem[];
            const convertedItems = backendItems.map(convertBackendCartItem);

            setCartItems(convertedItems);
            await saveCartLocal(convertedItems);
            console.log('[Cart] Synced with backend');
        } catch (error) {
            console.error('[Cart] Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [isAuthenticated]);

    // --------------------------------------------------------------------------
    // Add to cart - Optimistic UI + Backend sync
    // --------------------------------------------------------------------------
    const addToCart = useCallback(async (product: Product, size: string, quantity: number = 1) => {
        // Generate local ID (will be replaced by backend ID after sync)
        const localId = `local_${Date.now()}_${product.id}_${size}`;

        const newCartItem: CartItem = {
            id: localId,
            productId: product.id,
            size,
            quantity,
            product,
        };

        if (isNaN(Number(product.id))) {
            console.error('[Cart] Invalid product ID (not a number):', product.id);
            // Optionally show an alert or toast to the user
            return;
        }

        // 1. Optimistic update (instant UI feedback)
        setCartItems(prev => {
            // Check if same product+size exists
            const existingIndex = prev.findIndex(
                item => item.productId === product.id && item.size === size
            );

            if (existingIndex >= 0) {
                // Update quantity
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            return [...prev, newCartItem];
        });

        // 2. Save to local storage
        const updatedCart = [...cartItems, newCartItem];
        await saveCartLocal(updatedCart);

        // 3. Sync with backend if authenticated
        if (isAuthenticated) {
            try {
                await API.cart.add(Number(product.id), quantity);
                console.log('[Cart] Added to backend');

                // Sync to get the real backend ID
                await syncCart();
            } catch (error) {
                console.warn('[Cart] Backend add failed, keeping local:', error);
            }
        }

        // 4. Record interaction for ML
        try {
            await API.interactions.record('CART_ADD', Number(product.id), { size, quantity });
        } catch (error) {
            console.warn('[Cart] Failed to record CART_ADD interaction:', error);
        }
    }, [cartItems, isAuthenticated, syncCart]);

    // --------------------------------------------------------------------------
    // Remove from cart - Optimistic UI + Backend sync
    // --------------------------------------------------------------------------
    const removeFromCart = useCallback(async (cartItemId: string) => {
        // Find the item before removing
        const item = cartItems.find(i => i.id === cartItemId);

        // 1. Optimistic update
        setCartItems(prev => prev.filter(i => i.id !== cartItemId));

        // 2. Save to local storage
        const updatedCart = cartItems.filter(i => i.id !== cartItemId);
        await saveCartLocal(updatedCart);

        // 3. Sync with backend if authenticated and it's a backend ID
        if (isAuthenticated && !cartItemId.startsWith('local_')) {
            try {
                await API.cart.remove(cartItemId);
                console.log('[Cart] Removed from backend');
            } catch (error) {
                console.warn('[Cart] Backend remove failed:', error);
            }
        }

        // 4. Record interaction for ML
        if (item) {
            try {
                await API.interactions.record('CART_REMOVE', Number(item.productId));
            } catch (error) {
                console.warn('[Cart] Failed to record CART_REMOVE interaction:', error);
            }
        }
    }, [cartItems, isAuthenticated]);

    // --------------------------------------------------------------------------
    // Update quantity - Optimistic UI + Backend sync
    // --------------------------------------------------------------------------
    const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            return removeFromCart(cartItemId);
        }

        // 1. Optimistic update
        setCartItems(prev => prev.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
        ));

        // 2. Save to local storage
        const updatedCart = cartItems.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
        );
        await saveCartLocal(updatedCart);

        // 3. Sync with backend if authenticated
        if (isAuthenticated && !cartItemId.startsWith('local_')) {
            try {
                await API.cart.update(cartItemId, quantity);
                console.log('[Cart] Updated on backend');
            } catch (error) {
                console.warn('[Cart] Backend update failed:', error);
            }
        }
    }, [cartItems, isAuthenticated, removeFromCart]);

    // --------------------------------------------------------------------------
    // Clear cart
    // --------------------------------------------------------------------------
    const clearCart = useCallback(async () => {
        // 1. Clear local state
        setCartItems([]);

        // 2. Clear local storage
        await AsyncStorage.removeItem(CART_STORAGE_KEY);

        // 3. Clear backend if authenticated
        if (isAuthenticated) {
            try {
                await API.cart.clear();
                console.log('[Cart] Cleared backend');
            } catch (error) {
                console.warn('[Cart] Backend clear failed:', error);
            }
        }
    }, [isAuthenticated]);

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------
    const getCartTotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }, [cartItems]);

    const getCartCount = useCallback(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------
    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isLoading,
                isSyncing,
                syncCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
