import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, getAuthToken } from '@/services/api';
import { Config } from '@/constants/Config';

// ============================================================================
// Types
// ============================================================================

export interface UserPreferences {
    gender: 'Men' | 'Women' | string;
    size: string;
    likes: string[];
    dislikes: string[];
}

interface UserPreferencesContextType {
    preferences: UserPreferences | null;
    isLoading: boolean;
    isOnboardingComplete: boolean;

    // Temporary state during onboarding
    onboardingData: Partial<UserPreferences>;

    // Methods
    setGender: (gender: string) => void;
    setSize: (size: string) => void;
    setLikes: (likes: string[]) => void;
    setDislikes: (dislikes: string[]) => void;

    // Save to backend and local storage
    completeOnboarding: () => Promise<{ error: any }>;

    // Load preferences
    loadPreferences: () => Promise<void>;

    // Reset (for logout)
    // Reset (for logout)
    resetPreferences: () => void;

    // Explicitly save current preferences to backend (for sync after interactions)
    savePreferences: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const UserPreferencesContext = createContext<UserPreferencesContextType>({
    preferences: null,
    isLoading: true,
    isOnboardingComplete: false,
    onboardingData: {},
    setGender: () => { },
    setSize: () => { },
    setLikes: () => { },
    setDislikes: () => { },
    completeOnboarding: async () => ({ error: null }),
    loadPreferences: async () => { },
    resetPreferences: () => { },
    savePreferences: async () => { },
});

export const useUserPreferences = () => useContext(UserPreferencesContext);

// ============================================================================
// Default values
// ============================================================================

const DEFAULT_PREFERENCES: UserPreferences = {
    gender: 'Men',
    size: 'M',
    likes: [],
    dislikes: [],
};

// ============================================================================
// Provider
// ============================================================================

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

    // Temporary state during onboarding flow
    const [onboardingData, setOnboardingData] = useState<Partial<UserPreferences>>({});

    // --------------------------------------------------------------------------
    // Load preferences on mount
    // --------------------------------------------------------------------------
    const loadPreferences = useCallback(async () => {
        setIsLoading(true);

        try {
            // 1. Try local storage first (fast)
            const localData = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER_PREFERENCES);

            if (localData) {
                const parsed = JSON.parse(localData) as UserPreferences;
                setPreferences(parsed);
                setIsOnboardingComplete(true);
                console.log('[UserPreferences] Loaded from local storage');
            }

            // 2. Try to sync from backend if authenticated (source of truth)
            const token = await getAuthToken();

            if (token) {
                try {
                    const response = await API.products.getProfile();

                    if (response.data && response.data.preferenceValue) {
                        const backendPrefs = response.data.preferenceValue as UserPreferences;
                        setPreferences(backendPrefs);
                        setIsOnboardingComplete(true);

                        // Update local storage with backend data
                        await AsyncStorage.setItem(
                            Config.STORAGE_KEYS.USER_PREFERENCES,
                            JSON.stringify(backendPrefs)
                        );
                        console.log('[UserPreferences] Synced from backend');
                    } else if (!localData) {
                        // No data in backend and no local data = needs onboarding
                        setIsOnboardingComplete(false);
                        console.log('[UserPreferences] No profile found, needs onboarding');
                    }
                } catch (apiError: any) {
                    // API error - use local data if available
                    if (apiError.response?.status === 401) {
                        // Token might be expired
                        console.log('[UserPreferences] Token expired, using local data');
                    } else {
                        console.warn('[UserPreferences] API error:', apiError.message);
                    }
                }
            } else {
                // Not authenticated, use local data
                console.log('[UserPreferences] Not authenticated, using local data');
            }
        } catch (error) {
            console.error('[UserPreferences] Load error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load on mount
    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    // --------------------------------------------------------------------------
    // Onboarding setters (temporary state)
    // --------------------------------------------------------------------------
    const setGender = useCallback((gender: string) => {
        console.log('[UserPreferences] Setting gender:', gender);
        setOnboardingData(prev => ({ ...prev, gender }));
    }, []);

    const setSize = useCallback((size: string) => {
        console.log('[UserPreferences] Setting size:', size);
        setOnboardingData(prev => ({ ...prev, size }));
    }, []);

    const setLikes = useCallback((likes: string[]) => {
        console.log('[UserPreferences] Setting likes:', likes);
        setOnboardingData(prev => ({ ...prev, likes }));
    }, []);

    const setDislikes = useCallback((dislikes: string[]) => {
        console.log('[UserPreferences] Setting dislikes:', dislikes);
        setOnboardingData(prev => ({ ...prev, dislikes }));
    }, []);

    // --------------------------------------------------------------------------
    // Complete onboarding - Save to both local and backend
    // --------------------------------------------------------------------------
    const completeOnboarding = useCallback(async (): Promise<{ error: any }> => {
        try {
            // Merge with defaults
            const finalPreferences: UserPreferences = {
                gender: onboardingData.gender || DEFAULT_PREFERENCES.gender,
                size: onboardingData.size || DEFAULT_PREFERENCES.size,
                likes: onboardingData.likes || DEFAULT_PREFERENCES.likes,
                dislikes: onboardingData.dislikes || DEFAULT_PREFERENCES.dislikes,
            };

            console.log('[UserPreferences] Saving preferences:', finalPreferences);

            // 1. Save to local storage (instant access)
            await AsyncStorage.setItem(
                Config.STORAGE_KEYS.USER_PREFERENCES,
                JSON.stringify(finalPreferences)
            );
            console.log('[UserPreferences] Saved to local storage');

            // 2. Save to backend (for ML recommendations)
            try {
                await API.products.saveProfile(finalPreferences);
                console.log('[UserPreferences] Saved to backend');
            } catch (apiError: any) {
                // Backend save failed, but local is saved
                console.warn('[UserPreferences] Backend save failed:', apiError.message);
                // Don't block onboarding if backend fails
            }

            // 3. Update state
            setPreferences(finalPreferences);
            setIsOnboardingComplete(true);
            setOnboardingData({}); // Clear temporary data

            return { error: null };
        } catch (error: any) {
            console.error('[UserPreferences] Complete onboarding error:', error);
            return { error: error.message || 'Failed to save preferences' };
        }
    }, [onboardingData]);

    // --------------------------------------------------------------------------
    // Save current preferences to backend (Sync)
    // --------------------------------------------------------------------------
    const savePreferences = useCallback(async () => {
        if (!preferences) return;
        try {
            await API.products.saveProfile(preferences);
            console.log('[UserPreferences] Synced to backend');
        } catch (error) {
            console.error('[UserPreferences] Sync failed:', error);
        }
    }, [preferences]);

    // --------------------------------------------------------------------------
    // Reset preferences (for logout)
    // --------------------------------------------------------------------------
    const resetPreferences = useCallback(() => {
        setPreferences(null);
        setIsOnboardingComplete(false);
        setOnboardingData({});
        AsyncStorage.removeItem(Config.STORAGE_KEYS.USER_PREFERENCES).catch(() => { });
        console.log('[UserPreferences] Reset');
    }, []);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------
    return (
        <UserPreferencesContext.Provider
            value={{
                preferences,
                isLoading,
                isOnboardingComplete,
                onboardingData,
                setGender,
                setSize,
                setLikes,
                setDislikes,
                completeOnboarding,
                loadPreferences,
                resetPreferences,
                savePreferences,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}
