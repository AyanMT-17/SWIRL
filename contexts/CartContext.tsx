import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface Product {
    id: string;
    name: string;
    price: number;
    brand: string;
    product_images: { image_url: string }[];
}

export interface CartItem {
    id: string; // Unique ID for the cart entry (e.g. timestamp + productID)
    productId: string;
    size: string;
    quantity: number;
    product: Product; // Embed product details for easier display in Bag
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, size: string, quantity?: number) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartTotal: () => number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('swirl_cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Failed to load cart', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCart = async (items: CartItem[]) => {
        try {
            await AsyncStorage.setItem('swirl_cart', JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart', error);
        }
    };

    const addToCart = async (product: Product, size: string, quantity: number = 1) => {
        // Generate simple unique ID
        const newCartItem: CartItem = {
            id: `${Date.now()}-${product.id}-${size}`,
            productId: product.id,
            size,
            quantity,
            product
        };

        const updatedCart = [...cartItems, newCartItem];
        setCartItems(updatedCart);
        await saveCart(updatedCart);
        // Optional: Alert or Toast can be triggered here or in the UI component
    };

    const removeFromCart = async (cartItemId: string) => {
        const updatedCart = cartItems.filter(item => item.id !== cartItemId);
        setCartItems(updatedCart);
        await saveCart(updatedCart);
    };

    const clearCart = async () => {
        setCartItems([]);
        await AsyncStorage.removeItem('swirl_cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
