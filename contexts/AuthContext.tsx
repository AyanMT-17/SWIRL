import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, setAuthToken, getAuthToken, removeAuthToken, setOnUnauthorized, getStoredUser, setStoredUser, removeStoredUser } from '@/services/api';
import { Config } from '@/constants/Config';

// ============================================================================
// Types
// ============================================================================

interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
}

interface Session {
  access_token: string;
  token_type: string;
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  // OTP-based auth methods
  requestOtp: (emailOrPhone: string) => Promise<{ error: any; message?: string }>;
  verifyOtp: (emailOrPhone: string, code: string, name?: string) => Promise<{ error: any; user?: User }>;

  // Legacy methods (kept for backward compatibility)
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;

  // Profile check
  hasUsername: boolean;
  needsOnboarding: boolean;
  setNeedsOnboarding: (value: boolean) => void;
  refreshUser: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  requestOtp: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => { },
  hasUsername: false,
  needsOnboarding: false,
  setNeedsOnboarding: () => { },
  refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const isAuthenticated = !!session && !!user;
  const hasUsername = !!user?.name;

  // --------------------------------------------------------------------------
  // Initialize: Check for existing token on app start
  // --------------------------------------------------------------------------
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getAuthToken();

        if (token) {
          // Token exists, try to fetch user profile

          // 1. Try to load from local storage first (fast)
          const storedUser = await getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setSession({
              access_token: token,
              token_type: 'bearer',
              user: storedUser,
            });
          }

          try {
            // 2. Refresh from backend (background)
            const response = await API.auth.getMe();
            const userData = response.data;

            setUser(userData);
            await setStoredUser(userData); // Update local storage

            setSession({
              access_token: token,
              token_type: 'bearer',
              user: userData,
            });

            // Check if user needs onboarding (no shopper profile)
            try {
              const profileResponse = await API.products.getProfile();
              setNeedsOnboarding(!profileResponse.data);
            } catch {
              setNeedsOnboarding(true);
            }
          } catch (error) {
            console.warn('[Auth] Token verification failed:', error);
            // Only clear if we really can't authenticate
            if (!storedUser) {
              console.log('[Auth] Token invalid and no stored user, clearing...');
              await removeAuthToken();
              await removeStoredUser();
            }
          }
        }
      } catch (error) {
        console.error('[Auth] Init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // --------------------------------------------------------------------------
  // Set up unauthorized callback
  // --------------------------------------------------------------------------
  useEffect(() => {
    setOnUnauthorized(async () => {
      setSession(null);
      setUser(null);
      await removeStoredUser();
    });
  }, []);

  // --------------------------------------------------------------------------
  // Request OTP
  // --------------------------------------------------------------------------
  const requestOtp = useCallback(async (emailOrPhone: string): Promise<{ error: any; message?: string }> => {
    try {
      console.log('[Auth] Requesting OTP for:', emailOrPhone);
      const response = await API.auth.requestOtp(emailOrPhone);

      // In dev mode, log the expected OTP
      if (__DEV__) {
        console.log(`[Auth] Dev Mode - Use OTP: ${Config.DEV_OTP_CODE}`);
      }

      return { error: null, message: response.data?.message || 'OTP sent successfully' };
    } catch (error: any) {
      console.error('[Auth] Request OTP error:', error.response?.data || error.message);
      return {
        error: error.response?.data?.message || error.message || 'Failed to send OTP'
      };
    }
  }, []);

  // --------------------------------------------------------------------------
  // Verify OTP
  // --------------------------------------------------------------------------
  const verifyOtp = useCallback(async (
    emailOrPhone: string,
    code: string,
    name?: string
  ): Promise<{ error: any; user?: User }> => {
    try {
      console.log('[Auth] Verifying OTP for:', emailOrPhone);
      const response = await API.auth.verifyOtp(emailOrPhone, code, name);

      const { access_token, user: userData } = response.data;

      // Store the token
      await setAuthToken(access_token);
      await setStoredUser(userData);

      // Update state
      setUser(userData);
      setSession({
        access_token,
        token_type: 'bearer',
        user: userData,
      });

      // Check if user needs onboarding
      try {
        const profileResponse = await API.products.getProfile();
        setNeedsOnboarding(!profileResponse.data);
      } catch {
        setNeedsOnboarding(true);
      }

      console.log('[Auth] Login successful:', userData.name || userData.email);
      return { error: null, user: userData };
    } catch (error: any) {
      console.error('[Auth] Verify OTP error:', error.response?.data || error.message);
      return {
        error: error.response?.data?.message || error.message || 'Invalid OTP'
      };
    }
  }, []);

  // --------------------------------------------------------------------------
  // Refresh User
  // --------------------------------------------------------------------------
  const refreshUser = useCallback(async () => {
    try {
      console.log('[Auth] Refreshing user data...');
      const token = await getAuthToken();
      if (!token) return;

      const response = await API.auth.getMe();
      const userData = response.data;

      setUser(userData);
      await setStoredUser(userData);

      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          user: userData
        };
      });
      console.log('[Auth] User refreshed:', userData.name);
    } catch (error) {
      console.error('[Auth] Failed to refresh user:', error);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Legacy signUp (redirects to OTP flow)
  // --------------------------------------------------------------------------
  const signUp = useCallback(async (email: string, password: string): Promise<{ error: any }> => {
    // Redirect to OTP-based registration
    return requestOtp(email);
  }, [requestOtp]);

  // --------------------------------------------------------------------------
  // Legacy signIn (redirects to OTP flow)
  // --------------------------------------------------------------------------
  const signIn = useCallback(async (email: string, password: string): Promise<{ error: any }> => {
    // Redirect to OTP-based login
    return requestOtp(email);
  }, [requestOtp]);

  // --------------------------------------------------------------------------
  // Sign Out
  // --------------------------------------------------------------------------
  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('[Auth] --- Sign-out process started ---');

      // 1. Clear Auth Storage
      console.log('[Auth] Clearing tokens and user data...');
      await removeAuthToken();
      await removeStoredUser();

      // 2. Clear Additional Storage
      const keysToClear = [
        Config.STORAGE_KEYS.USER_PREFERENCES,
        Config.STORAGE_KEYS.CART,
        'swirl_swiped_product_ids',
        'swirl_liked_product_ids'
      ];

      console.log('[Auth] Clearing additional storage keys:', keysToClear);
      for (const key of keysToClear) {
        try {
          await AsyncStorage.removeItem(key);
        } catch (e) {
          console.warn(`[Auth] Failed to clear key ${key}:`, e);
        }
      }

      // 3. Reset State
      console.log('[Auth] Resetting internal state...');
      setSession(null);
      setUser(null);
      setNeedsOnboarding(false);

      console.log('[Auth] --- Sign-out complete ---');
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated,
        requestOtp,
        verifyOtp,
        signUp,
        signIn,
        signOut,
        hasUsername,
        needsOnboarding,
        setNeedsOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
