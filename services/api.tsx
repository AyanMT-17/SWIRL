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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
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
// Create Axios Instances
// ============================================================================

/**
 * Backend API Instance (User Service - :4000)
 * Used for: Auth, Cart, Wishlist, Orders, User Profile, Preferences
 */
const api: AxiosInstance = axios.create({
    baseURL: Config.API_BASE_URL,
    timeout: Config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * AI Service Instance (:8000)
 * Used for: Recommendations, NL Queries, Feed, ML-powered features
 */
const aiApi: AxiosInstance = axios.create({
    baseURL: Config.AI_SERVICE_URL,
    timeout: Config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================================================
// Request Interceptor - Inject JWT Token (Backend API)
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
// Request Interceptor - Inject JWT Token (AI Service API)
// ============================================================================

aiApi.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('[AI] Failed to get token from SecureStore:', error);
        }

        // Development logging
        if (__DEV__) {
            console.log(`[AI] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[AI] Request Error:', error.message);
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
// Response Interceptor - Handle Errors (AI Service API)
// ============================================================================

aiApi.interceptors.response.use(
    (response: AxiosResponse) => {
        if (__DEV__) {
            console.log(`[AI] Response ${response.status} from ${response.config.url}`);
        }
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        if (__DEV__) {
            console.error(`[AI] Error ${status}: ${message}`);
        }

        // For AI Service, 401 should also trigger logout
        if (status === 401) {
            console.warn('[AI] Unauthorized - Token may be expired');
            if (onUnauthorized) {
                onUnauthorized();
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
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(Config.STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
            await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
        }
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
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(Config.STORAGE_KEYS.AUTH_TOKEN);
        } else {
            return await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
        }
    } catch (error) {
        console.warn('[API] Failed to get auth token:', error);
        return null;
    }
};

/**
 * Remove stored authentication token
 */
/**
 * Remove stored authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(Config.STORAGE_KEYS.AUTH_TOKEN);
        } else {
            await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
        }
    } catch (error) {
        console.warn('[API] Failed to remove auth token:', error);
    }
};

/**
 * Store user data locally
 * Note: We use AsyncStorage for user data (non-sensitive profile info) on all platforms
 * because SecureStore has size limits and is better suited for small secrets like tokens.
 */
export const setStoredUser = async (user: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(Config.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
        console.error('[API] Failed to store user data:', error);
    }
};

/**
 * Get stored user data
 */
export const getStoredUser = async (): Promise<any | null> => {
    try {
        const json = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER_DATA);
        return json ? JSON.parse(json) : null;
    } catch (error) {
        console.warn('[API] Failed to get user data:', error);
        return null;
    }
};

/**
 * Remove stored user data
 */
export const removeStoredUser = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER_DATA);
    } catch (error) {
        console.warn('[API] Failed to remove user data:', error);
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
        updateProfile: (data: { name?: string; avatar?: string; email?: string; phone?: string }) =>
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
        getAll: (page: number = 1, limit: number = 20, filters?: { q?: string; category?: string; gender?: string;[key: string]: any }) =>
            api.get('/products', { params: { page, limit, ...filters } }),

        /**
         * Get personalized recommendations (requires saved profile)
         */
        getRecommendations: (category?: string, limit: number = 10) =>
            api.post(`/products/recommend/user?limit=${limit}${category ? `&category=${category}` : ''}`),

        /**
         * Smart Search
         */
        search: (query: string) =>
            api.get('/products/search', { params: { q: query } }),

        /**
         * Get recommendations with explicit preferences (for guests)
         */
        getRecommendationsWithPrefs: (preferences: {
            likes: string[];
            dislikes: string[];
            size: string;
            gender: string;
        }, category?: string, limit: number = 10) => api.post(`/products/recommend?limit=${limit}${category ? `&category=${category}` : ''}`, preferences),

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

    // --------------------------------------------------------------------------
    // AI Service Endpoints (Direct calls to AI Service :8000)
    // --------------------------------------------------------------------------
    ai: {
        /**
         * Get ML-powered recommendation feed
         * @param limit - Number of recommendations (default: 20)
         * @param filters - Optional filters for recommendations
         */
        getFeed: (limit: number = 20, filters?: {
            gender?: string;
            category?: string;
            price_min?: number;
            price_max?: number;
        }) => aiApi.get('/recommendations/feed', {
            params: { limit, ...filters }
        }),

        /**
         * Natural Language Query - Get recommendations based on text query
         * @param query - Natural language query (e.g., "casual party outfit")
         * @param limit - Number of results (default: 10)
         */
        nlQuery: (query: string, limit: number = 10) =>
            aiApi.post('/recommendations/nl-query', { query, limit }),

        /**
         * Record user interaction for ML training (AI Service)
         * @param interactionType - Type of interaction
         * @param itemId - Product ID
         * @param context - Additional context
         */
        recordInteraction: (
            interactionType: 'view' | 'like' | 'dislike' | 'cart_add' | 'purchase',
            itemId: number,
            context?: Record<string, any>
        ) => aiApi.post('/recommendations/interactions', {
            interaction_type: interactionType,
            item_id: itemId,
            context
        }),

        /**
         * Get similar items (AI-powered)
         * @param itemId - Product ID to find similar items for
         * @param limit - Number of similar items
         */
        getSimilar: (itemId: number, limit: number = 10) =>
            aiApi.get(`/items/${itemId}/similar`, { params: { limit } }),

        /**
         * Get item details from AI Service
         * @param itemId - Product ID
         */
        getItem: (itemId: number) => aiApi.get(`/items/${itemId}`),

        /**
         * Check AI Service health/availability
         */
        healthCheck: () => aiApi.get('/health'),
    },
};

// Export the raw axios instances for advanced use cases
export { aiApi };
export default api;
