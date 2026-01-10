import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LikesProvider } from '@/contexts/LikesContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <CartProvider>
        <LikesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="location-select" />
            <Stack.Screen name="phone-login" />
            <Stack.Screen name="otp-verify" />
            <Stack.Screen name="create-username" />
            <Stack.Screen name="referral-code" />
            <Stack.Screen name="friends-invite" />
            <Stack.Screen name="gender-select" />
            <Stack.Screen name="dob-select" />
            <Stack.Screen name="feed-select" />
            <Stack.Screen name="size-select" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="auth" />
          </Stack>
          <StatusBar style="auto" />
        </LikesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
