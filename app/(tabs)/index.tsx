import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FilterState } from '@/components/FilterModal';
import FilterModal from '@/components/FilterModal';
import { useProductFeed } from '@/contexts/ProductFeedContext';
import { API } from '@/services/api';
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

  // Search State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced Backend Search
  React.useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        console.log('[Home] Searching Backend:', searchQuery);
        const response = await API.products.search(searchQuery);
        // Map backend products to App format if needed (assuming API returns similar structure or we use helper)
        // We'll trust the API returns what we need or map it basic
        const rawProducts = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const mappedProducts = rawProducts;
        setSearchResults(mappedProducts);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  // Filter products by category and search
  const availableProducts = useMemo(() => {
    // 1. If we have a search query, show backend results (Natural Language Search)
    if (searchQuery.trim().length > 0) {
      if (searchResults.length > 0) return searchResults;
      // If searching but no results yet (or empty), return empty or keep previous?
      // Let's return empty to show "No results" or loading state if we want.
      // But for smooth UX, maybe we wait? No, instant feedback is better.
      return searchResults;
    }

    // 2. Otherwise, use Client-Side Filtering on the Feed
    return products.filter(product => {
      // Ensure categories is an array and filter out null/undefined values
      const productCategories = (product.categories || [product.category] || []).filter(c => !!c);

      // Must match primary category (Top/Bottom/Foot)
      const matchesPrimaryCategory = productCategories.some(cat =>
        cat.toLowerCase().includes(selectedCategory.toLowerCase())
      );

      // Optionally match secondary subcategory (Lite/Premium/Luxe/Streetwear)
      let matchesSubcategory = true;
      if (selectedSubcategory) {
        const sub = selectedSubcategory.toLowerCase();
        // Map UI subcategories to properties
        if (sub === 'lite') {
          matchesSubcategory = product.price < 1000 || product.properties?.price_tier === 'budget';
        } else if (sub === 'premium') {
          matchesSubcategory = (product.price >= 1000 && product.price <= 5000) || product.properties?.price_tier === 'premium';
        } else if (sub === 'luxe' || sub === 'lux') {
          matchesSubcategory = product.price > 5000 || product.properties?.price_tier === 'luxury';
        } else if (sub === 'streetwear') {
          matchesSubcategory = product.properties?.style === 'streetwear' || productCategories.some(c => c.toLowerCase().includes('street'));
        } else {
          matchesSubcategory = productCategories.some(cat => cat.toLowerCase().includes(sub));
        }
      }

      return matchesPrimaryCategory && matchesSubcategory;
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, searchResults]);

  // Handle Search Submission (Trigger Backend Search)
  // This logic should ideally reside in `HomeHeader` or a `useEffect` here.
  // Since `HomeHeader` just sets `setSearchQuery`, we can watch `searchQuery` here.

  /* 
     NOTE: Implementing full Backend Search on Home requires replacing the Feed Context data.
     For now, we recommend users use the Discovery Tab for advanced search.
     But we can add a "Search on Discovery" button if local results are empty.
  */

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
      // router.push(`/product/${filteredCurrentProduct.id}`);
      console.log('View details clicked:', filteredCurrentProduct.id);
    }
  }, [filteredCurrentProduct, router]);

  const handleAddToCart = useCallback(async (size: string) => {
    // Placeholder interaction record if needed
  }, []);

  const handleBuyNow = useCallback((size: string) => {
    // Alert.alert('Coming Soon', 'Checkout functionality will be available soon!');
    console.log('Buy Now clicked', size);
  }, []);

  const handleUndo = useCallback(() => {
    // Alert.alert('Undo', 'Undo not available in this version');
    console.log('Undo clicked');
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Refresh Feed',
      'This will reset your filters and refresh recommendations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refresh',
          onPress: async () => {
            // Reset Filters
            setSelectedCategory('Top');
            setSelectedSubcategory(null);
            setSearchQuery('');
            setActiveFilters(null);
            setCurrentIndex(0); // Also reset index to show fresh batch from start

            // Refetch Feed
            await refreshFeed();

            Alert.alert('Refreshed', 'Filters reset and feed updated.');
          }
        }
      ]
    );
  }, [refreshFeed]);

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
