import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'DISCOVER YOUR\nSTYLE',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'DEFINE YOUR\nIDENTITY',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'CONNECT WITH\nSWIRL',
    image: 'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = () => {
    router.replace('/auth');
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 relative">
        <Image
          source={{ uri: slides[currentSlide].image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute bottom-0 left-0 right-0 h-1/2"
        />

        <View className="absolute top-20 left-0 right-0 items-center">
          <Text className="text-white text-4xl font-bold tracking-widest">
            SWIRL
          </Text>
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-6 pb-12">
          <Text className="text-white text-4xl font-bold text-center mb-8 leading-tight">
            {slides[currentSlide].title}
          </Text>

          <View className="flex-row justify-center items-center mb-8">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full mx-1 ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-gray-500'
                  }`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={currentSlide < slides.length - 1 ? handleNext : handleGetStarted}
            className="bg-[#eecfb4] py-4 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-black text-center font-bold text-lg">
              Get started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
