import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MOCK_PRODUCTS, Product } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, ArrowPathIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, ArrowTrendingUpIcon, SparklesIcon, StarIcon, ClockIcon, TagIcon } from 'react-native-heroicons/outline';
import FilterModal, { FilterState } from '@/components/FilterModal';
import { useRecommendation } from '@/contexts/RecommendationContext';
import SwipeableProductCard from '@/components/SwipeableProductCard';

const { width, height } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = width / 393;
const heightScale = height / 852;
const scale = Math.min(widthScale, heightScale);

// Responsive header dimensions (based on iPhone 16 specs)
const HEADER_HEIGHT = Math.round(150 * heightScale);
const HEADER_BORDER_RADIUS = Math.round(24 * scale);
const ICON_SIZE = Math.round(24 * scale);
const BUTTON_SIZE = Math.round(40 * scale);

const PRIMARY_CATEGORIES = ['Top', 'Bottom', 'Foot'];
const SECONDARY_CATEGORIES = ['Lite', 'Premium', 'New Arrivals', 'Streetwear', 'Sneaker', 'Vintage', 'Denim', 'Accessories'];

// Search-focused categories (from reference image)
const SEARCH_PRIMARY_CATEGORIES = ['Trending', 'Top', 'Bottom', 'Foot', 'Accessories'];
const SEARCH_SECONDARY_CATEGORIES = ['Lite', 'Premium', 'Luxe', 'Street wear'];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  // Filter products based on selected category and exclude already liked/skipped
  const availableProducts = useMemo(() => {
    // Get products sorted by recommendation score, excluding already interacted ones
    const recommended = getRecommendedProducts();

    return recommended.filter(product => {
      // Check if product is in the selected category using categories array
      // Enriched items preserve original categories if present, or fallback to single category property check
      const productCategories = product.categories || [product.category];
      const matchesCategory = productCategories.includes(selectedCategory);

      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, getRecommendedProducts]);

  // Get current and next products for stack effect
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
    // Placeholder - checkout functionality removed
    Alert.alert('Coming Soon', 'Checkout functionality will be available soon!');
  }, []);

  const handleUndo = useCallback(() => {
    // Undo not implemented in simple RecommendationContext yet
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
      <View className="flex-1 bg-black">
        {/* Floating Header - Responsive based on iPhone 16 specs */}
        {/* Border: 16 all sides, Padding: 16 top/bottom, 8 left/right, Content: 344x100 */}
        <View
          style={{
            backgroundColor: '#FDFFF2',
            zIndex: 50,
            overflow: 'hidden',
            // height: HEADER_HEIGHT, // Removed fixed height to accommodate dynamic safe area
            borderRadius: HEADER_BORDER_RADIUS,
            paddingTop: Math.max(insets.top, Math.round(44 * heightScale)),
            paddingBottom: Math.round(10 * heightScale),
            paddingLeft: Math.round(16 * scale),
            paddingRight: Math.round(16 * scale),
          }}
        >
          {/* Top Row - Search Bar with 8px left/right inner padding */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Math.round(8 * scale),
            paddingHorizontal: Math.round(8 * scale),
            marginBottom: Math.round(16 * scale),
          }}>
            <TouchableOpacity
              style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E1E2C3',
                borderRadius: BUTTON_SIZE / 2,
              }}
              onPress={() => {
                if (isSearchFocused) {
                  setIsSearchFocused(false);
                  setSearchQuery('');
                }
              }}
            >
              <ChevronLeftIcon size={ICON_SIZE} color="#000" />
            </TouchableOpacity>

            <View style={{
              flex: 1, // Results in 249px width on iPhone 16 (393 - 72 left - 72 right)
              height: Math.round(40 * scale),
              minWidth: Math.round(116 * scale),
              backgroundColor: '#E1E2C3',
              borderRadius: 9999,
              paddingHorizontal: Math.round(16 * scale),
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: Math.round(13 * scale),
                  fontWeight: '500',
                  fontFamily: 'DMSans_500Medium',
                  color: '#1f2937',
                  textAlign: isSearchFocused ? 'left' : 'center',
                  paddingVertical: 0,
                }}
                placeholder={isSearchFocused ? "What should i wear to the beach?" : "What's your vibe today?"}
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
              />
            </View>

            <TouchableOpacity
              style={{
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E1E2C3',
                borderRadius: BUTTON_SIZE / 2,
              }}
              onPress={isSearchFocused ? () => { } : handleReset}
            >
              {isSearchFocused ? (
                <MagnifyingGlassIcon size={Math.round(20 * scale)} color="#000" strokeWidth={2} />
              ) : (
                <ArrowPathIcon size={Math.round(20 * scale)} color="#000" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          {/* Category Filters - Dynamic based on search focus */}
          {isSearchFocused ? (
            // Search-focused categories (two rows)
            <View style={{ paddingHorizontal: Math.round(8 * scale) }}>
              {/* First Row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: Math.round(8 * scale), paddingBottom: Math.round(8 * scale) }}
              >
                {SEARCH_PRIMARY_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={{
                      paddingHorizontal: Math.round(16 * scale),
                      paddingVertical: Math.round(10 * scale),
                      borderRadius: 9999,
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Math.round(6 * scale),
                      backgroundColor: selectedCategory === category ? '#000' : '#fff',
                      borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                    }}
                  >
                    {category === 'Trending' && (
                      <ArrowTrendingUpIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />
                    )}
                    <Text
                      style={{
                        fontSize: Math.round(14 * scale),
                        fontWeight: '600',
                        fontFamily: 'DMSans_600SemiBold',
                        color: selectedCategory === category ? '#fff' : '#111827',
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Second Row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: Math.round(8 * scale) }}
              >
                {SEARCH_SECONDARY_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={{
                      paddingHorizontal: Math.round(16 * scale),
                      paddingVertical: Math.round(10 * scale),
                      borderRadius: 9999,
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Math.round(6 * scale),
                      backgroundColor: selectedCategory === category ? '#000' : '#fff',
                      borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                    }}
                  >
                    {category === 'Lite' && <SparklesIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    {category === 'Premium' && <StarIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    {category === 'Luxe' && <SparklesIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    {category === 'Street wear' && <TagIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    <Text
                      style={{
                        fontSize: Math.round(14 * scale),
                        fontWeight: '600',
                        fontFamily: 'DMSans_600SemiBold',
                        color: selectedCategory === category ? '#fff' : '#111827',
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            // Default categories (single row)
            <View style={{ paddingLeft: Math.round(8 * scale) }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: Math.round(8 * scale), paddingRight: Math.round(20 * scale) }}
              >
                <TouchableOpacity
                  style={{
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: BUTTON_SIZE / 2,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    marginRight: Math.round(4 * scale),
                  }}
                  onPress={() => setIsFilterVisible(true)}
                >
                  <AdjustmentsHorizontalIcon size={Math.round(18 * scale)} color="#000" />
                </TouchableOpacity>

                {/* Primary Categories */}
                {PRIMARY_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={{
                      paddingHorizontal: Math.round(24 * scale),
                      paddingVertical: Math.round(10 * scale),
                      borderRadius: 9999,
                      borderWidth: 1,
                      backgroundColor: selectedCategory === category ? '#000' : '#fff',
                      borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Math.round(14 * scale),
                        fontWeight: '600',
                        fontFamily: 'DMSans_600SemiBold',
                        color: selectedCategory === category ? '#fff' : '#111827',
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Separator */}
                <View style={{
                  height: Math.round(32 * scale),
                  width: 1,
                  backgroundColor: '#d1d5db',
                  marginHorizontal: Math.round(8 * scale),
                  alignSelf: 'center'
                }} />

                {/* Secondary Categories */}
                {SECONDARY_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={{
                      paddingHorizontal: Math.round(20 * scale),
                      paddingVertical: Math.round(10 * scale),
                      borderRadius: 9999,
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Math.round(6 * scale),
                      backgroundColor: selectedCategory === category ? '#000' : '#fff',
                      borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                    }}
                  >
                    {category === 'Lite' && <SparklesIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    {category === 'Premium' && <StarIcon size={Math.round(14 * scale)} color={selectedCategory === category ? '#fff' : '#000'} />}
                    <Text
                      style={{
                        fontSize: Math.round(14 * scale),
                        fontWeight: '600',
                        fontFamily: 'DMSans_600SemiBold',
                        color: selectedCategory === category ? '#fff' : '#111827',
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Card Stack Area */}
        <View className="flex-1 items-center pt-1">
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
            // Card Stack - Full width container
            <View style={{ width: width, height: height - 170, alignItems: 'center' }}>
              {/* Background card (next product) */}
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

              {/* Foreground card (current product) */}
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

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApplyFilter={(filters) => {
          setActiveFilters(filters);
          // Apply brand filter to search query if brands are selected
          const selectedBrands = filters.selectedItems['Brands'] || [];
          if (selectedBrands.length > 0) {
            setSearchQuery(selectedBrands.join(' '));
          } else {
            setSearchQuery('');
          }
        }}
        initialFilters={activeFilters || undefined}
      />
    </GestureHandlerRootView>
  );
}
