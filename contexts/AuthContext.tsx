import React, { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase'; // Removed
// Mock Session/User types if needed or just use any/custom interfaces for now to avoid supabase-js dependency if we are removing it.
// Actually, I should redefine Session/User interfaces locally to remove @supabase/supabase-js dependency completely.

interface User {
  id: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
}

interface Session {
  access_token: string;
  token_type: string;
  user: User;
  refresh_token: string;
  expires_in: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasUsername: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => { },
  hasUsername: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // No loading needed for mock
  const [hasUsername, setHasUsername] = useState(true); // Mock user has username

  // Mock initial session
  useEffect(() => {
    // Simulate no session initially
    setSession(null);
    setUser(null);
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('Mock SignUp:', email);
    // Simulate successful signup and login
    const mockUser: User = {
      id: 'mock-user-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockSession: Session = {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      user: mockUser,
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
    };
    setSession(mockSession);
    setUser(mockUser);
    setHasUsername(true);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Mock SignIn:', email);
    // Simulate successful login
    const mockUser: User = {
      id: 'mock-user-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockSession: Session = {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      user: mockUser,
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
    };
    setSession(mockSession);
    setUser(mockUser);
    setHasUsername(true);
    return { error: null };
  };

  const signOut = async () => {
    console.log('Mock SignOut');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        hasUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
