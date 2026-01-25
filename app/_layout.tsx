import '../global.css';
import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LikesProvider } from '@/contexts/LikesContext';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

import { RecommendationProvider } from '@/contexts/RecommendationContext';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <LikesProvider>
          <RecommendationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="location-select" />
              <Stack.Screen name="phone-login" />
              <Stack.Screen name="otp-verify" />
              <Stack.Screen name="gender-select" />
              <Stack.Screen name="feed-select" />
              <Stack.Screen name="invite-unlock" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="auth" />
            </Stack>
            <StatusBar style="dark" />
          </RecommendationProvider>
        </LikesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
