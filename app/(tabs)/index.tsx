import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FilterState } from '@/components/FilterModal';
import FilterModal from '@/components/FilterModal';
import { useRecommendation } from '@/contexts/RecommendationContext';
import SwipeableProductCard from '@/components/SwipeableProductCard';
import OnboardingTour from '@/components/OnboardingTour';
import HomeHeader from '@/components/home/HomeHeader';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    handleSwipeRight,
    handleSwipeLeft,
    getRecommendedProducts,
    isLoading,
    resetData
  } = useRecommendation();

  const [selectedCategory, setSelectedCategory] = useState('Top');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleTourComplete = () => {
    router.setParams({ showTour: '' });
  };

  const availableProducts = useMemo(() => {
    const recommended = getRecommendedProducts();
    return recommended.filter(product => {
      const productCategories = product.categories || [product.category];
      const matchesCategory = productCategories.includes(selectedCategory);
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, getRecommendedProducts]);

  const currentProduct = availableProducts[0];
  const nextProduct = availableProducts[1];

  const handleLike = useCallback(async () => {
    if (currentProduct) {
      await handleSwipeRight(currentProduct);
    }
  }, [currentProduct, handleSwipeRight]);

  const handleSkip = useCallback(async () => {
    if (currentProduct) {
      await handleSwipeLeft(currentProduct);
    }
  }, [currentProduct, handleSwipeLeft]);

  const handleViewDetails = useCallback(async () => {
    if (currentProduct) {
      router.push(`/product/${currentProduct.id}`);
    }
  }, [currentProduct, router]);

  const handleAddToCart = useCallback(async (size: string) => {
    // Placeholder interaction record if needed
  }, []);

  const handleBuyNow = useCallback((size: string) => {
    Alert.alert('Coming Soon', 'Checkout functionality will be available soon!');
  }, []);

  const handleUndo = useCallback(() => {
    Alert.alert('Undo', 'Undo not available in this version');
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Feed',
      'Are you sure you want to reset your recommendations? This will clear all likes and skips.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert('Reset Complete', 'Your feed has been reset.');
          }
        }
      ]
    );
  }, [resetData]);

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
    <View style={{ flex: 1 }}>
      <View className="flex-1 bg-black">
        <HomeHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
          handleReset={handleReset}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onFilterPress={() => setIsFilterVisible(true)}
        />

        {/* Card Stack Area */}
        <View className="flex-1 items-center pt-1">
          {availableProducts.length === 0 ? (
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
            <View style={{ flex: 1, width: width, alignItems: 'center' }}>
              {nextProduct && (
                <SwipeableProductCard
                  key={`next-${nextProduct.id}`}
                  product={nextProduct}
                  onLike={() => { }}
                  onSkip={() => { }}
                  onViewDetails={() => { }}
                  onAddToCart={() => { }}
                  onBuyNow={() => { }}
                  isFirst={false}
                />
              )}

              {currentProduct && (
                <SwipeableProductCard
                  key={`current-${currentProduct.id}`}
                  product={currentProduct}
                  onLike={handleLike}
                  onSkip={handleSkip}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  isFirst={true}
                />
              )}
            </View>
          )}
        </View>
      </View>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApplyFilter={(filters) => {
          setActiveFilters(filters);
          const selectedBrands = filters.selectedItems['Brands'] || [];
          if (selectedBrands.length > 0) {
            setSearchQuery(selectedBrands.join(' '));
          } else {
            setSearchQuery('');
          }
        }}
        initialFilters={activeFilters || undefined}
      />

      <OnboardingTour
        visible={params.showTour === 'true'}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />
    </View>
  );
}
