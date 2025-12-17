import React from 'react';
import { View, Text, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import ProductCard from '@/components/ProductCard';
import HomeHeader from '@/components/HomeHeader';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Trending', 'New Drops', 'Sale', 'Accessories', 'Shoes'];

export default function Home() {
  const router = useRouter();

  const renderHeader = () => (
    <View className="pb-6 pt-32">
      {/* Hero Section */}
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        className="mx-4 mb-8 h-80 rounded-[40px] overflow-hidden relative"
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          className="absolute inset-0 justify-end p-8"
        >
          <View className="bg-white/20 backdrop-blur-md self-start px-4 py-1.5 rounded-full mb-3 border border-white/30">
            <Text className="text-white text-xs font-bold uppercase tracking-widest">
              New Collection
            </Text>
          </View>
          <Text className="text-white text-4xl font-black tracking-tight mb-2">
            Urban{"\n"}Essentials
          </Text>
          <Text className="text-gray-200 font-medium">
            Discover the latest trends for the season.
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Categories Scroller */}
      <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} className="pl-4 mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className={`mr-3 px-6 py-3 rounded-full border ${index === 0 ? 'bg-black border-black' : 'bg-transparent border-gray-200'}`}
            >
              <Text className={`font-bold ${index === 0 ? 'text-white' : 'text-black'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F5F5F7]">
      <HomeHeader />

      <FlatList
        data={MOCK_PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 100 + 400).duration(800).springify()}
            className="flex-1 mb-4"
          >
            <ProductCard
              product={item}
              onLike={() => { }}
              onDislike={() => { }}
              onShare={() => { }}
            />
          </Animated.View>
        )}
        numColumns={1} // Keeping 1 column for the "Card Swing" feel from ProductCard, or we can move to 2.
        // ProductCard is designed as a large card. Staying with 1 col for premium feel as per current ProductCard design.
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
