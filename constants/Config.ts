/**
 * Application Configuration
 * 
 * Contains environment-specific settings for the SWIRL app.
 */

// Determine the API base URL based on environment
const getApiBaseUrl = (): string => {
    // For Android Emulator, use 10.0.2.2 to access host machine's localhost
    // For iOS Simulator, use localhost
    // For Physical Device, use your machine's local IP address

    if (__DEV__) {
        // Development mode
        // Replace with your machine's local IP for physical device testing
        // Example: "http://192.168.1.100:4000/api/v1"
        return "http://10.0.91.51:4000/api/v1"; // Android Emulator default
    }

    // Production mode
    return "https://api.swirl.com/api/v1"; // Replace with production URL
};

export const Config = {
    /**
     * Base URL for all API calls
     */
    API_BASE_URL: getApiBaseUrl(),

    /**
     * Storage keys used throughout the app
     */
    STORAGE_KEYS: {
        AUTH_TOKEN: 'swirl_auth_token',
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
