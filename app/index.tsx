import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthToken, getStoredUser } from '@/services/api';

export default function Index() {
  const { session, loading, hasUsername } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    // Timer for splash screen
    const timer = setTimeout(() => {
      setIsSplashFinished(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkDirectAccess = async () => {
      try {
        const currentSegment = segments[0];
        console.log('[Index] Segments:', segments, 'Loading:', loading);

        // 1. If we are already in the apps (tabs), don't do anything
        if (currentSegment === '(tabs)') {
          console.log('[Index] Already in tabs, staying put');
          return;
        }

        // 2. Check all local storage keys (Token, User Profile, Preferences)
        // We use AsyncStorage for User and Preferences, SecureStore (or AsyncStorage on Web) for Token
        const token = await getAuthToken();
        const storedUser = await getStoredUser();

        // This is a direct check of the storage to bypass AuthContext lag
        const hasStoredCreds = !!token && !!storedUser;

        console.log('[Index] Fast Check:', { hasToken: !!token, hasUser: !!storedUser });

        if (hasStoredCreds) {
          console.log('[Index] Found local credentials, jumping to home');
          router.replace('/(tabs)');
          return;
        }

        // 3. Fallback to AuthContext state if no direct storage found
        if (loading) {
          console.log('[Index] No local storage yet, waiting for AuthContext...');
          return;
        }

        if (session) {
          console.log('[Index] AuthContext has session, going to tabs');
          router.replace('/(tabs)');
        } else {
          // Only go to onboarding if we are ABSOLUTELY sure no session exists
          console.log('[Index] No session found, redirecting to onboarding');
          router.replace('/onboarding');
        }
      } catch (e) {
        console.error('[Index] Redirection error:', e);
        // Default fallback
        router.replace('/onboarding');
      }
    };

    if (isSplashFinished) {
      checkDirectAccess();
    }
  }, [isSplashFinished, loading, session, segments]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Animated.View entering={FadeIn.duration(1000)} exiting={FadeOut.duration(500)}>
        <Text className="text-white text-5xl font-black tracking-tighter">
          SWIRL.
        </Text>
      </Animated.View>
    </View>
  );
}
