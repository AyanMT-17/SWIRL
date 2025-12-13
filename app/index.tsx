import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, Text, Animated, Dimensions } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, loading, hasUsername } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Timer for splash screen
    const timer = setTimeout(() => {
      setIsSplashFinished(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSplashFinished || loading) return;

    const inAuth = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    // Logic: Always show onboarding if not logged in, or check session
    // For now, mirroring previous logic but only after splash
    if (!session) {
      router.replace('/onboarding');
    } else if (session && !hasUsername) {
      router.replace('/create-username');
    } else {
      router.replace('/(tabs)');
    }

  }, [isSplashFinished, loading, session, hasUsername]);

  if (!isSplashFinished || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-white text-6xl font-bold tracking-widest">
            SWIRL.
          </Text>
        </Animated.View>
      </View>
    );
  }

  return null;
}
