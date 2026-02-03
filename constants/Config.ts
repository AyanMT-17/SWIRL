/**
 * Application Configuration
 * 
 * Contains environment-specific settings for the SWIRL app.
 */

// Get IP address for API calls
const getHostIP = (): string => {
    // Replace with your machine's local IP for physical device testing
    return "10.0.91.51";
};

// Determine the Backend API base URL based on environment
const getApiBaseUrl = (): string => {
    // For Android Emulator, use 10.0.2.2 to access host machine's localhost
    // For iOS Simulator, use localhost
    // For Physical Device, use your machine's local IP address

    if (__DEV__) {
        // Development mode
        return `http://${getHostIP()}:4000/api/v1`;
    }

    // Production mode
    return "https://api.swirl.com/api/v1"; // Replace with production URL
};

// Determine the AI Service base URL based on environment
const getAiServiceUrl = (): string => {
    if (__DEV__) {
        // Development mode - AI Service runs on port 8000
        return `http://${getHostIP()}:8000`;
    }

    // Production mode
    return "https://ai.swirl.com"; // Replace with production URL
};

export const Config = {
    /**
     * Base URL for Backend API calls (User Service - Auth, Cart, Orders)
     */
    API_BASE_URL: getApiBaseUrl(),

    /**
     * Base URL for AI Service calls (Recommendations, NL Queries, Feed)
     */
    AI_SERVICE_URL: getAiServiceUrl(),

    /**
     * Storage keys used throughout the app
     */
    STORAGE_KEYS: {
        AUTH_TOKEN: 'swirl_auth_token',
        USER_DATA: 'swirl_user_data',
        USER_PREFERENCES: 'swirl_user_preferences',
        CART: 'swirl_cart',
    },

    /**
     * API Timeout in milliseconds
     */
    API_TIMEOUT: 15000,

    /**
     * Development OTP code (when backend SMS is not configured)
     */
    DEV_OTP_CODE: '1234',
} as const;

export type ConfigType = typeof Config;
