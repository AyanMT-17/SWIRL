import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, RotateCcw } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['Top', 'Bottom', 'Food', 'Lite', 'Premium'];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('Top');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 bg-white">
      {/* Fixed Header */}
      <View
        className="absolute top-0 left-0 right-0 z-50 bg-[#F5F3EE]"
        style={{ paddingTop: insets.top }}
      >
        {/* Top Row */}
        <View className="flex-row items-center gap-3 px-4 py-3">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <ChevronLeft size={24} color="#000" strokeWidth={2} />
          </TouchableOpacity>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="What's your vibe today?"
            placeholderTextColor="#6B7280"
            className="flex-1 text-sm font-medium text-gray-900 text-center"
          />

          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <RotateCcw size={20} color="#000" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 pb-3"
          contentContainerStyle={{ gap: 8 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full ${selectedCategory === category
                ? 'bg-black'
                : 'bg-transparent border border-gray-300'
                }`}
            >
              <Text className={`text-sm font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-700'
                }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Card - Full Screen */}
      <View className="flex-1 mt-32">
        <FlatList
          data={MOCK_PRODUCTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const mainImage = item.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
            const thumbnails = item.product_images.slice(0, 3).map(img => img.image_url);
            while (thumbnails.length < 3) thumbnails.push(mainImage);

            const isExpanded = expandedProduct === item.id;

            return (
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => setExpandedProduct(isExpanded ? null : item.id)}
              >
                <Animated.View
                  entering={FadeInDown.duration(600)}
                  className="mx-4 mb-4 rounded-[32px] overflow-hidden bg-white"
                  style={{ height: height - 220 }}
                >
                  {/* Main Product Image */}
                  <Image
                    source={{ uri: mainImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />

                  {/* Thumbnail Strip */}
                  <View className="absolute right-4 top-4 gap-2">
                    {thumbnails.map((uri, index) => (
                      <TouchableOpacity
                        key={index}
                        className="w-14 h-20 rounded-xl overflow-hidden border-2 border-white/80 shadow-lg"
                      >
                        <Image
                          source={{ uri }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Bottom Info Card */}
                  <View className="absolute bottom-0 left-0 right-0">
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                      className="p-6"
                    >
                      <ScrollView
                        className="bg-white rounded-3xl p-5"
                        style={{ maxHeight: isExpanded ? height - 400 : 200 }}
                        showsVerticalScrollIndicator={false}
                      >
                        {/* Seller Info */}
                        <View className="flex-row items-center justify-between mb-3">
                          <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
                            <Text className="text-xs font-semibold text-gray-600">
                              {item.brand}
                            </Text>
                          </View>
                          <TouchableOpacity className="p-2">
                            <Text className="text-2xl">🤍</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Product Info */}
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-lg font-bold text-gray-900 flex-1" numberOfLines={isExpanded ? undefined : 2}>
                            {item.name}
                          </Text>
                          <Text className="text-xl font-bold text-gray-900 ml-4">
                            ₹ {item.price.toLocaleString('en-IN')}
                          </Text>
                        </View>

                        {/* Star Rating */}
                        {isExpanded && (
                          <View className="flex-row items-center mb-4">
                            <Text className="text-yellow-500">★★★★☆</Text>
                            <Text className="text-xs text-gray-500 ml-2">4.0</Text>
                          </View>
                        )}

                        {/* Size Options */}
                        <View className="flex-row gap-2 mt-2">
                          {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                            <TouchableOpacity
                              key={size}
                              onPress={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-full border ${selectedSize === size ? 'bg-black border-black' : 'border-gray-300'}`}
                            >
                              <Text className={`text-xs font-semibold ${selectedSize === size ? 'text-white' : 'text-gray-700'}`}>
                                {size}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <View className="mt-4">
                            <Text className="text-xs text-gray-600 leading-5 mb-4">
                              {item.description}
                            </Text>
                            <Text className="text-xs text-gray-600 leading-5 mb-4">
                              • Material: Premium cotton blend{"\n"}
                              • Fit: Regular/Relaxed{"\n"}
                              • Care: Machine wash cold{"\n"}
                              • 100% Cotton
                            </Text>

                            {/* Action Buttons */}
                            <View className="flex-row gap-3 mt-2">
                              <TouchableOpacity className="flex-1 bg-white border border-gray-800 py-4 rounded-2xl items-center">
                                <Text className="text-sm font-bold text-gray-900">Add to Cart</Text>
                              </TouchableOpacity>
                              <TouchableOpacity className="flex-1 bg-[#E8B298] py-4 rounded-2xl items-center">
                                <Text className="text-sm font-bold text-gray-900">Buy Now</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </ScrollView>
                    </LinearGradient>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* Bottom Brand */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#F5F3EE] py-4 items-center border-t border-gray-200"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text className="text-2xl font-black tracking-tighter text-gray-900">
          SWIRL.
        </Text>
      </View>
    </View>
  );
}
