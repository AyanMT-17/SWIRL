import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API, setAuthToken, getAuthToken, removeAuthToken, setOnUnauthorized } from '@/services/api';
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
          try {
            const response = await API.auth.getMe();
            const userData = response.data;

            setUser(userData);
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
            // Token invalid or expired
            console.log('[Auth] Token invalid, clearing...');
            await removeAuthToken();
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
    setOnUnauthorized(() => {
      setSession(null);
      setUser(null);
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
    console.log('[Auth] Signing out...');
    await removeAuthToken();
    setSession(null);
    setUser(null);
    setNeedsOnboarding(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
