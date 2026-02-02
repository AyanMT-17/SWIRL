/**
 * API Communication Layer
 * 
 * This is the SINGLE point of communication with the backend.
 * All API calls go through this module.
 * 
 * Features:
 * - Axios instance with base URL configuration
 * - Automatic JWT token injection
 * - Automatic 401 handling (logout)
 * - Request/Response logging in development
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/Config';

// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// ============================================================================
// Create Axios Instance
// ============================================================================

const api: AxiosInstance = axios.create({
    baseURL: Config.API_BASE_URL,
    timeout: Config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================================================
// Request Interceptor - Inject JWT Token
// ============================================================================

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            // SecureStore might fail on web, ignore silently
            console.warn('[API] Failed to get token from SecureStore:', error);
        }

        // Development logging
        if (__DEV__) {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[API] Request Error:', error.message);
        return Promise.reject(error);
    }
);

// ============================================================================
// Response Interceptor - Handle Errors
// ============================================================================

// Callback for handling logout (will be set by AuthContext)
let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
    onUnauthorized = callback;
};

api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Development logging
        if (__DEV__) {
            console.log(`[API] Response ${response.status} from ${response.config.url}`);
        }
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        // Development logging
        if (__DEV__) {
            console.error(`[API] Error ${status}: ${message}`);
        }

        // Handle 401 Unauthorized - Token expired or invalid
        if (status === 401) {
            const requestUrl = error.config?.url || '';

            // Don't trigger logout for auth endpoints (invalid credentials != expired session)
            const isAuthEndpoint = requestUrl.includes('/auth/');

            if (isAuthEndpoint) {
                // Auth endpoint 401s are credential errors, not session errors
                if (__DEV__) {
                    console.log('[API] Auth endpoint 401 - credential error, not triggering logout');
                }
            } else {
                // Non-auth 401s mean the token is expired/invalid
                console.warn('[API] Unauthorized - Clearing token and triggering logout');

                try {
                    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
                } catch (e) {
                    // Ignore SecureStore errors
                }

                // Trigger logout callback if set
                if (onUnauthorized) {
                    onUnauthorized();
                }
            }
        }

        return Promise.reject(error);
    }
);

// ============================================================================
// Token Management Helpers
// ============================================================================

/**
 * Store authentication token securely
 */
export const setAuthToken = async (token: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
        console.error('[API] Failed to store auth token:', error);
        throw error;
    }
};

/**
 * Get stored authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.warn('[API] Failed to get auth token:', error);
        return null;
    }
};

/**
 * Remove stored authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.warn('[API] Failed to remove auth token:', error);
    }
};

// ============================================================================
// API Methods - Single Entry Point for All Backend Calls
// ============================================================================

export const API = {
    // --------------------------------------------------------------------------
    // Auth Endpoints
    // --------------------------------------------------------------------------
    auth: {
        /**
         * Request OTP for login/registration
         * @param emailOrPhone - Email or phone number
         */
        requestOtp: (emailOrPhone: string) => {
            const isEmail = emailOrPhone.includes('@');
            return api.post('/auth/otp/request', {
                [isEmail ? 'email' : 'phone']: emailOrPhone,
            });
        },

        /**
         * Verify OTP and get JWT token
         * @param emailOrPhone - Email or phone number
         * @param code - OTP code
         * @param name - User name (optional, for registration)
         */
        verifyOtp: (emailOrPhone: string, code: string, name?: string) => {
            const isEmail = emailOrPhone.includes('@');
            return api.post('/auth/otp/verify', {
                [isEmail ? 'email' : 'phone']: emailOrPhone,
                code,
                ...(name && { name }),
            });
        },

        /**
         * Get current user profile
         */
        getMe: () => api.get('/auth/me'),
    },

    // --------------------------------------------------------------------------
    // User Endpoints
    // --------------------------------------------------------------------------
    users: {
        /**
         * Get current user profile (detailed)
         */
        getProfile: () => api.get('/users/me'),

        /**
         * Update user profile
         */
        updateProfile: (data: { name?: string; avatar?: string }) =>
            api.put('/users/me', data),
    },

    // --------------------------------------------------------------------------
    // Products Endpoints
    // --------------------------------------------------------------------------
    products: {
        /**
         * Get paginated products
         * @param page - Page number (1-indexed)
         * @param limit - Items per page (default: 20)
         */
        getAll: (page: number = 1, limit: number = 20, searchQuery?: string) =>
            api.get('/products', { params: { page, limit, q: searchQuery } }),

        /**
         * Get personalized recommendations (requires saved profile)
         */
        getRecommendations: () =>
            api.post('/products/recommend/user'),

        /**
         * Get recommendations with explicit preferences (for guests)
         */
        getRecommendationsWithPrefs: (preferences: {
            likes: string[];
            dislikes: string[];
            size: string;
            gender: string;
        }) => api.post('/products/recommend', preferences),

        /**
         * Get saved shopper profile
         */
        getProfile: () => api.get('/products/profile'),

        /**
         * Save shopper profile (preferences)
         */
        saveProfile: (preferences: {
            likes: string[];
            dislikes: string[];
            size: string;
            gender: string;
        }) => api.post('/products/profile', preferences),
    },

    // --------------------------------------------------------------------------
    // Cart Endpoints
    // --------------------------------------------------------------------------
    cart: {
        /**
         * Get user's cart
         */
        get: () => api.get('/cart'),

        /**
         * Add item to cart
         * @param itemId - Product ID
         * @param quantity - Quantity (default: 1)
         */
        add: (itemId: string | number, quantity: number = 1) =>
            api.post('/cart', { itemId, quantity }),

        /**
         * Update cart item quantity
         * @param cartItemId - Cart item ID
         * @param quantity - New quantity
         */
        update: (cartItemId: string, quantity: number) =>
            api.put(`/cart/${cartItemId}`, { quantity }),

        /**
         * Remove item from cart
         * @param cartItemId - Cart item ID
         */
        remove: (cartItemId: string) => api.delete(`/cart/${cartItemId}`),

        /**
         * Clear entire cart
         */
        clear: () => api.delete('/cart'),
    },

    // --------------------------------------------------------------------------
    // Wishlist Endpoints
    // --------------------------------------------------------------------------
    wishlist: {
        /**
         * Get user's wishlist
         */
        get: () => api.get('/wishlist'),

        /**
         * Add item to wishlist
         * @param itemId - Product ID
         */
        add: (itemId: string | number) => api.post('/wishlist', { itemId }),

        /**
         * Remove item from wishlist
         * @param wishlistItemId - Wishlist item ID
         */
        remove: (wishlistItemId: string) => api.delete(`/wishlist/${wishlistItemId}`),
    },

    // --------------------------------------------------------------------------
    // Orders Endpoints
    // --------------------------------------------------------------------------
    orders: {
        /**
         * Create order from cart items
         * @param cartItemIds - Array of cart item IDs
         * @param shippingAddressId - Shipping address ID
         */
        create: (cartItemIds: string[], shippingAddressId: string) =>
            api.post('/orders', { cartItemIds, shippingAddressId }),

        /**
         * Get user's orders
         */
        getAll: () => api.get('/orders'),

        /**
         * Get order by ID
         * @param orderId - Order ID
         */
        getById: (orderId: string) => api.get(`/orders/${orderId}`),
    },

    // --------------------------------------------------------------------------
    // Interactions Endpoints (ML/Analytics)
    // --------------------------------------------------------------------------
    interactions: {
        /**
         * Record user interaction for ML training
         * @param interactionType - Type: VIEW, LIKE, DISLIKE, CART_ADD, CART_REMOVE, etc.
         * @param itemId - Product ID
         * @param metadata - Optional additional data
         */
        record: (
            interactionType: 'VIEW' | 'LIKE' | 'DISLIKE' | 'CART_ADD' | 'CART_REMOVE' | 'WISHLIST_ADD' | 'WISHLIST_REMOVE' | 'ORDER_COMPLETE',
            itemId: string | number,
            metadata?: Record<string, any>
        ) => api.post('/interactions', { interactionType, itemId, metadata }),

        /**
         * Get user's interactions
         */
        getAll: () => api.get('/interactions'),
    },

    // --------------------------------------------------------------------------
    // Preferences Endpoints
    // --------------------------------------------------------------------------
    preferences: {
        /**
         * Get all user preferences
         */
        getAll: () => api.get('/preferences'),

        /**
         * Get specific preference
         * @param type - Preference type
         */
        get: (type: string) => api.get(`/preferences/${type}`),

        /**
         * Set preference
         * @param preferenceType - Type of preference
         * @param preferenceValue - Value
         */
        set: (preferenceType: string, preferenceValue: unknown) =>
            api.post('/preferences', { preferenceType, preferenceValue }),

        /**
         * Delete preference
         * @param type - Preference type
         */
        delete: (type: string) => api.delete(`/preferences/${type}`),
    },
};

// Export the raw axios instance for advanced use cases
export default api;
