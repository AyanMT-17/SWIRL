import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, RotateCcw, RefreshCcw } from 'lucide-react-native';
import { useLikes, Product } from '@/contexts/LikesContext';
import SwipeableProductCard from '@/components/SwipeableProductCard';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['Top', 'Bottom', 'Footwear', 'Accessories', 'Premium'];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    likedProducts,
    skippedProductIds,
    likeProduct,
    skipProduct,
    recordInteraction,
    undoLastAction,
    isLoading,
  } = useLikes();

  const [selectedCategory, setSelectedCategory] = useState('Top');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products based on selected category and exclude already liked/skipped
  const availableProducts = useMemo(() => {
    const likedIds = new Set(likedProducts.map(p => p.id));

    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = product.category === selectedCategory;
      const isNotLiked = !likedIds.has(product.id);
      const isNotSkipped = !skippedProductIds.includes(product.id);
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && isNotLiked && isNotSkipped && matchesSearch;
    }) as Product[];
  }, [selectedCategory, likedProducts, skippedProductIds, searchQuery]);

  // Get current and next products for stack effect
  const currentProduct = availableProducts[0];
  const nextProduct = availableProducts[1];

  const handleLike = useCallback(async () => {
    if (currentProduct) {
      await likeProduct(currentProduct);
    }
  }, [currentProduct, likeProduct]);

  const handleSkip = useCallback(async () => {
    if (currentProduct) {
      await skipProduct(currentProduct);
    }
  }, [currentProduct, skipProduct]);

  const handleViewDetails = useCallback(async () => {
    if (currentProduct) {
      await recordInteraction(currentProduct, 'view');
      router.push(`/product/${currentProduct.id}`);
    }
  }, [currentProduct, recordInteraction, router]);

  const handleAddToCart = useCallback(async (size: string) => {
    if (currentProduct) {
      await recordInteraction(currentProduct, 'cart');
    }
  }, [currentProduct, recordInteraction]);

  const handleUndo = useCallback(async () => {
    const undoneProduct = await undoLastAction();
    if (undoneProduct) {
      Alert.alert('Undo', `Brought back ${undoneProduct.name}`);
    } else {
      Alert.alert('Undo', 'Nothing to undo');
    }
  }, [undoLastAction]);

  const handleReset = useCallback(() => {
    // Reset to show all products (would need to clear skipped - could add this to context)
    Alert.alert(
      'Reset Products',
      'This would normally refresh the product feed from the server.',
      [{ text: 'OK' }]
    );
  }, []);

  // Handle category change - reset view
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F5F3EE] items-center justify-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-[#F5F3EE]">
        {/* Fixed Header */}
        <View
          className="bg-[#F5F3EE] z-50"
          style={{ paddingTop: insets.top }}
        >
          {/* Top Row */}
          <View className="flex-row items-center gap-3 px-4 py-3">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={handleUndo}
            >
              <RotateCcw size={20} color="#000" strokeWidth={2} />
            </TouchableOpacity>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="What's your vibe today?"
              placeholderTextColor="#6B7280"
              className="flex-1 text-sm font-medium text-gray-900 text-center bg-white/50 rounded-full px-4 py-2"
            />

            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={handleReset}
            >
              <RefreshCcw size={20} color="#000" strokeWidth={2} />
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
                onPress={() => handleCategoryChange(category)}
                className={`px-5 py-2 rounded-full ${selectedCategory === category
                  ? 'bg-black'
                  : 'bg-transparent border border-gray-300'
                  }`}
              >
                <Text
                  className={`text-sm font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-700'
                    }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Card Stack Area */}
        <View className="flex-1 items-center justify-center px-4">
          {availableProducts.length === 0 ? (
            // No more products message
            <View className="items-center justify-center p-8 bg-white rounded-3xl shadow-lg">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                You've seen it all! 🎉
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                No more products in {selectedCategory} category.{'\n'}
                Try another category or check your SWIRLs!
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/swirl')}
                  className="bg-[#E8B298] px-6 py-3 rounded-full"
                >
                  <Text className="font-bold text-gray-900">View SWIRLs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUndo}
                  className="bg-gray-200 px-6 py-3 rounded-full"
                >
                  <Text className="font-bold text-gray-700">Undo Last</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Card Stack
            <View style={{ width: width - 32, height: height - 280 }}>
              {/* Background card (next product) */}
              {nextProduct && (
                <SwipeableProductCard
                  key={`next-${nextProduct.id}`}
                  product={nextProduct}
                  onLike={() => { }}
                  onSkip={() => { }}
                  onViewDetails={() => { }}
                  onAddToCart={() => { }}
                  isFirst={false}
                />
              )}

              {/* Foreground card (current product) */}
              {currentProduct && (
                <SwipeableProductCard
                  key={`current-${currentProduct.id}`}
                  product={currentProduct}
                  onLike={handleLike}
                  onSkip={handleSkip}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  isFirst={true}
                />
              )}
            </View>
          )}

          {/* Swipe Instructions */}
          {availableProducts.length > 0 && (
            <View className="absolute bottom-4 left-0 right-0 items-center">
              <View className="bg-white/90 rounded-full px-6 py-2 flex-row items-center gap-4">
                <Text className="text-xs text-gray-500">↑ Details</Text>
                <Text className="text-xs text-gray-500">↓ Cart</Text>
              </View>
            </View>
          )}
        </View>

        {/* Products remaining counter */}
        {availableProducts.length > 0 && (
          <View className="absolute bottom-32 right-6 bg-black/80 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              {availableProducts.length} left
            </Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
