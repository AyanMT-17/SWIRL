import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  AnimatedStyle,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
  }
];

const MARQUEE_TEXT = "DISCOVER   YOUR   STYLE   WITH   SWIRL.   ";

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Marquee Animation
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width * 2, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false // Do not reverse
    );
  }, []);

  const marqueeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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

        {/* Pagination Dots */}
        <View className="flex-row justify-center gap-2 mb-6 pointer-events-none">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-1 rounded-full ${index === currentSlide ? 'w-8 bg-[#ccfd51]' : 'w-2 bg-white/30'}`}
            />
          ))}
        </View>

        {/* Subtext */}
        <View className="mb-4 px-4 pointer-events-none">
          <Text className="text-gray-400 text-center text-xs font-medium tracking-wide">
            Experience the whole new way of <Text className="text-[#ccfd51] font-bold">"Fashion Discovery"</Text>
          </Text>
        </View>

        {/* Marquee Text Area - Cream Pill */}
        <View className="mb-2 mx-2 overflow-hidden bg-[#FDFDE8] h-20 rounded-[24px] relative">
          <Animated.View className="flex-row absolute items-center h-full" style={marqueeStyle}>
            <Text className="text-black text-4xl font-black tracking-tight whitespace-nowrap uppercase line-through-none include-font-padding-false" style={{ transform: [{ translateY: 2 }] }}>
              {MARQUEE_TEXT}
            </Text>
            <Text className="text-black text-4xl font-black tracking-tight whitespace-nowrap uppercase line-through-none include-font-padding-false" style={{ transform: [{ translateY: 2 }] }}>
              {MARQUEE_TEXT}
            </Text>
            <Text className="text-black text-4xl font-black tracking-tight whitespace-nowrap uppercase line-through-none include-font-padding-false" style={{ transform: [{ translateY: 2 }] }}>
              {MARQUEE_TEXT}
            </Text>
          </Animated.View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          className="mx-2 bg-[#eecfb4] h-20 rounded-[24px] flex-row items-center justify-center relative overflow-hidden mb-0"
        >
          <Text className="text-black font-bold text-lg">
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
