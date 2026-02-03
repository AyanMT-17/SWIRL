import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
} from 'react-native-reanimated';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=800',
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Auto-forward if already logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getAuthToken, getStoredUser } = require('@/services/api');
        const token = await getAuthToken();
        const user = await getStoredUser();
        if (token && user) {
          console.log('[Onboarding] Already logged in, auto-forwarding to tabs');
          router.replace('/(tabs)');
        }
      } catch (err) {
        // Ignore
      }
    };
    checkAuth();
  }, [router]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/location-select');
    }
  };


  return (
    <View className="flex-1 bg-black">
      {/* Background Image */}
      <Animated.View
        key={currentSlide}
        entering={FadeIn.duration(1000)}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          source={{ uri: SLIDES[currentSlide].image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Gradient Overlay for Text Readability - Darker at bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'black']}
          className="absolute inset-0"
          locations={[0, 0.6, 1]}
        />
      </Animated.View>

      {/* Top Logo */}
      <View className="absolute top-14 left-0 right-0 items-center z-10">
        <Text className="text-white text-3xl font-black tracking-widest">
          SWIRL.
        </Text>
      </View>

      {/* Bottom Content Container */}
      <View className="absolute bottom-0 left-0 right-0 pb-10">

        {/* Subtext */}
        <View className="mb-4 px-4 pointer-events-none">
          <Text className="text-gray-400 text-center text-xs font-medium tracking-wide">
            <Text className="text-[#ccfd51] font-bold">discover fashion like never before</Text>
          </Text>
        </View>

        {/* Static Text Area - Cream Pill */}
        <View className="mb-1 mx-2 bg-[#FDFDE8] h-24 rounded-[24px] items-center justify-center w-[96%]">
          <Text className="text-black text-5xl font-black tracking-tight uppercase">
            UNIQUELY   YOU
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          className="mx-2 bg-[#eecfb4] h-24 rounded-[24px] flex-row items-center justify-center relative overflow-hidden mb-0"
        >
          <Text className="text-black font-bold text-lg">
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
