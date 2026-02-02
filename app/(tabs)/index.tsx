import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FilterState } from '@/components/FilterModal';
import FilterModal from '@/components/FilterModal';
import { useProductFeed } from '@/contexts/ProductFeedContext';
import SwipeableProductCard from '@/components/SwipeableProductCard';
import OnboardingTour from '@/components/OnboardingTour';
import HomeHeader from '@/components/home/HomeHeader';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Use new ProductFeedContext (backend data)
  const {
    products,
    currentProduct,
    nextProduct,
    isLoading,
    isPreFetching,
    error,
    remainingCount,
    handleSwipeRight,
    handleSwipeLeft,
    resetFeed,
    refreshFeed,
  } = useProductFeed();

  const [selectedCategory, setSelectedCategory] = useState('Top');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cardContainerHeight, setCardContainerHeight] = useState(0);

  const handleTourComplete = () => {
    router.setParams({ showTour: '' });
  };

  // Filter products by category and search
  const availableProducts = useMemo(() => {
    return products.filter(product => {
      const productCategories = product.categories || [product.category];
      // Must match primary category (Top/Bottom/Foot)
      const matchesPrimaryCategory = productCategories.some(cat =>
        cat.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      // Optionally match secondary subcategory (Lite/Premium/Luxe/Streetwear)
      const matchesSubcategory = !selectedSubcategory || productCategories.some(cat =>
        cat.toLowerCase().includes(selectedSubcategory.toLowerCase())
      );
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPrimaryCategory && matchesSubcategory && matchesSearch;
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery]);

  // Get current and next from filtered list
  const filteredCurrentProduct = availableProducts[0];
  const filteredNextProduct = availableProducts[1];

  const handleLike = useCallback(async () => {
    if (filteredCurrentProduct) {
      await handleSwipeRight(filteredCurrentProduct);
    }
  }, [filteredCurrentProduct, handleSwipeRight]);

  const handleSkip = useCallback(async () => {
    if (filteredCurrentProduct) {
      await handleSwipeLeft(filteredCurrentProduct);
    }
  }, [filteredCurrentProduct, handleSwipeLeft]);

  const handleViewDetails = useCallback(async () => {
    if (filteredCurrentProduct) {
      router.push(`/product/${filteredCurrentProduct.id}`);
    }
  }, [filteredCurrentProduct, router]);

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
            await resetFeed();
            Alert.alert('Reset Complete', 'Your feed has been reset.');
          }
        }
      ]
    );
  }, [resetFeed]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  }, []);

  const handleSubcategoryChange = useCallback((subcategory: string) => {
    // Toggle: if already selected, deselect it; otherwise select it
    setSelectedSubcategory(prev => prev === subcategory ? null : subcategory);
    setCurrentIndex(0);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F5F3EE] items-center justify-center">
        <ActivityIndicator size="large" color="#E8B298" />
        <Text className="text-gray-600 mt-4">Loading products...</Text>
        {isPreFetching && (
          <Text className="text-gray-400 text-sm mt-2">Fetching more...</Text>
        )}
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-[#F5F3EE] items-center justify-center p-8">
        <Text className="text-red-500 text-lg font-bold mb-2">Error</Text>
        <Text className="text-gray-600 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={refreshFeed}
          className="bg-[#E8B298] px-6 py-3 rounded-full"
        >
          <Text className="font-bold text-gray-900">Try Again</Text>
        </TouchableOpacity>
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
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={handleSubcategoryChange}
          onFilterPress={() => setIsFilterVisible(true)}
        />

        {/* Card Stack Area */}
        <View
          className="flex-1 items-center pt-1"
          onLayout={(e) => setCardContainerHeight(e.nativeEvent.layout.height - 100)}
        >
          {availableProducts.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: 'white', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8 }}>
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
              {filteredNextProduct && (
                <SwipeableProductCard
                  key={`next-${filteredNextProduct.id}`}
                  product={filteredNextProduct}
                  onLike={() => { }}
                  onSkip={() => { }}
                  onViewDetails={() => { }}
                  onAddToCart={() => { }}
                  onBuyNow={() => { }}
                  isFirst={false}
                  containerHeight={cardContainerHeight > 0 ? cardContainerHeight : undefined}
                />
              )}

              {filteredCurrentProduct && (
                <SwipeableProductCard
                  key={`current-${filteredCurrentProduct.id}`}
                  product={filteredCurrentProduct}
                  onLike={handleLike}
                  onSkip={handleSkip}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  isFirst={true}
                  containerHeight={cardContainerHeight > 0 ? cardContainerHeight : undefined}
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
