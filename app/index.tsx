import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, loading, hasUsername } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    // Timer for splash screen
    const timer = setTimeout(() => {
      setIsSplashFinished(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSplashFinished || loading) return;

    // Logic: Always show onboarding if not logged in
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
        <Animated.View entering={FadeIn.duration(1000)} exiting={FadeOut.duration(500)}>
          <Text className="text-white text-5xl font-black tracking-tighter">
            SWIRL.
          </Text>
        </Animated.View>
      </View>
    );
  }

  return <View className="flex-1 bg-black" />;
}
