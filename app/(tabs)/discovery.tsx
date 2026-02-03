import { useRouter } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { SafeExpoSpeechRecognitionModule, useSafeSpeechRecognitionEvent } from "@/utils/SafeSpeechRecognition";
import DiscoveryHeader from '@/components/discovery/DiscoveryHeader';
import DiscoverySection from '@/components/discovery/DiscoverySection';
import SwipeableProductCard from '@/components/SwipeableProductCard';
import {
  nearYouData,
  trendingFashionData,
  lifestyleData,
  myBrandsData
} from '@/components/discovery/data';
import { API } from '@/services/api';
import { Squares2X2Icon, RectangleStackIcon } from 'react-native-heroicons/outline';
import { convertToAppProduct } from '@/contexts/ProductFeedContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_WIDTH = 110;
const FEED_BORDER_RADIUS = 24;

export default function Discovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeContainerHeight, setSwipeContainerHeight] = useState(0);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const debounceTimerInfo = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSafeSpeechRecognitionEvent("start", () => setIsListening(true));
  useSafeSpeechRecognitionEvent("end", () => setIsListening(false));
  useSafeSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      setSearchQuery(event.results[0]?.transcript || "");
    }
  });
  useSafeSpeechRecognitionEvent("error", (error) => {
    console.log("Speech recognition error:", error);
    setIsListening(false);
  });

  // Search with Debounce
  // PRIMARY: products.json is the data source (via Backend)
  // OPTIONAL: AI NL Query for semantic search enhancement
  useEffect(() => {
    if (debounceTimerInfo.current) clearTimeout(debounceTimerInfo.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerInfo.current = setTimeout(async () => {
      try {
        console.log('[Discovery] Searching Smart Backend:', searchQuery);

        // Use the new Smart Search Endpoint
        const response = await API.products.search(searchQuery);
        // Robustly handle paginated ({ data: [...] }) or flat ([...]) response
        const rawProducts = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const products = rawProducts.map(convertToAppProduct);

        console.log(`[Discovery] ✓ Found ${products.length} products`);
        setSearchResults(products);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 600); // 600ms debounce

    return () => {
      if (debounceTimerInfo.current) clearTimeout(debounceTimerInfo.current);
    };
  }, [searchQuery]);

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Photo Captured', 'Image search functionality would process this image.');
    }
  };

  const handleMic = async () => {
    if (isListening) {
      SafeExpoSpeechRecognitionModule.stop();
      return;
    }

    const { status } = await SafeExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Voice Search Unavailable",
        "Microphone access is required. If you are on Expo Go, this feature requires a Development Build."
      );
      return;
    }

    SafeExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
    });
  };

  // Swipeable Card Handlers
  const handleLike = useCallback(async () => {
    const currentProduct = searchResults[currentIndex];
    // Optimistic update
    setCurrentIndex(prev => prev + 1);

    if (currentProduct) {
      try {
        console.log('[Discovery] Liking product:', currentProduct.name);
        // 1. Record Interaction
        await API.interactions.record('LIKE', Number(currentProduct.id));
        // 2. Add to Swirl (Wishlist)
        await API.wishlist.add(Number(currentProduct.id));
      } catch (e) {
        console.error('[Discovery] Failed to record like:', e);
      }
    }
  }, [searchResults, currentIndex]);

  const handleSkip = useCallback(async () => {
    const currentProduct = searchResults[currentIndex];
    // Optimistic update
    setCurrentIndex(prev => prev + 1);

    if (currentProduct) {
      try {
        console.log('[Discovery] Skipping product:', currentProduct.name);
        await API.interactions.record('DISLIKE', Number(currentProduct.id));
      } catch (e) {
        console.error('[Discovery] Failed to record dislike:', e);
      }
    }
  }, [searchResults, currentIndex]);

  const handleViewDetails = (productId: string) => {
    // router.push(`/product/${productId}`);
    console.log('View details clicked:', productId);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="dark-content" />

      <DiscoveryHeader
        insets={insets}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isListening={isListening}
        handleCamera={handleCamera}
        handleMic={handleMic}
        onBack={handleBack}
      />

      {/* Feed Section */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFFF2',
          borderTopLeftRadius: FEED_BORDER_RADIUS,
          borderTopRightRadius: FEED_BORDER_RADIUS,
          borderBottomLeftRadius: FEED_BORDER_RADIUS,
          borderBottomRightRadius: FEED_BORDER_RADIUS,
          marginTop: 4,
          marginBottom: 94,
          overflow: 'hidden',
        }}
      >
        {searchQuery.trim().length > 0 ? (
          // === API SEARCH RESULTS VIEW ===
          <View className="flex-1">
            {/* Search Header & Toggle */}
            <View className="flex-row items-center justify-between px-4 pt-4 pb-2 z-10 bg-[#FDFFF2]">
              <Text className="text-black text-base font-bold">
                Results for "{searchQuery}"
              </Text>

              {/* Layout Toggle */}
              <View className="flex-row bg-gray-200 rounded-full p-1 h-10 items-center">
                <TouchableOpacity
                  onPress={() => setViewMode('grid')}
                  style={[
                    { padding: 6, borderRadius: 9999 },
                    viewMode === 'grid' && { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 }
                  ]}
                >
                  <Squares2X2Icon size={20} color={viewMode === 'grid' ? '#000' : '#888'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setViewMode('swipe')}
                  style={[
                    { padding: 6, borderRadius: 9999 },
                    viewMode === 'swipe' && { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 }
                  ]}
                >
                  <RectangleStackIcon size={20} color={viewMode === 'swipe' ? '#000' : '#888'} />
                </TouchableOpacity>
              </View>
            </View>

            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : searchResults.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">No products found.</Text>
              </View>
            ) : viewMode === 'grid' ? (
              // === GRID VIEW ===
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 100, paddingHorizontal: 16 }}
              >
                <View className="flex-row flex-wrap justify-between">
                  {searchResults.map((item, index) => (
                    <TouchableOpacity
                      key={item.id || index}
                      style={{ width: '48%', marginBottom: 16 }}
                      onPress={() => console.log('Search item clicked:', item.id)}
                    >
                      <Image
                        source={{ uri: item.product_images?.[0]?.image_url }}
                        style={{ width: '100%', aspectRatio: 0.75, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      <View className="p-3 bg-white rounded-b-xl">
                        <Text className="text-black font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-gray-500 text-xs mt-1">{item.brand}</Text>
                        <Text className="text-black font-bold text-sm mt-1">₹ {item.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              // === SWIPE VIEW ===
              <View
                style={{ flex: 1, position: 'relative', paddingBottom: 8 }}
                onLayout={(e) => setSwipeContainerHeight(e.nativeEvent.layout.height - 16)}
              >
                {currentIndex < searchResults.length ? (
                  <SwipeableProductCard
                    key={searchResults[currentIndex].id}
                    product={searchResults[currentIndex]}
                    onLike={handleLike}
                    onSkip={handleSkip}
                    onViewDetails={() => handleViewDetails(searchResults[currentIndex].id)}
                    onAddToCart={(size) => console.log('Added to cart', size)}
                    onBuyNow={(size) => console.log('Buy now', size)}
                    isFirst={true}
                    containerHeight={swipeContainerHeight > 0 ? swipeContainerHeight : undefined}
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500 text-lg">That's all for now!</Text>
                    <TouchableOpacity
                      className="mt-4 bg-black px-6 py-3 rounded-full"
                      onPress={() => setCurrentIndex(0)}
                    >
                      <Text className="text-white font-bold">Start Over</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          // === DEFAULT DISCOVERY VIEW (Local) ===
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          >
            <DiscoverySection
              title="Near You"
              data={nearYouData}
              cardWidth={CARD_WIDTH}
            />
            <DiscoverySection
              title="Trending Fashion"
              data={trendingFashionData}
              cardWidth={CARD_WIDTH}
            />
            <DiscoverySection
              title="Lifestyle"
              data={lifestyleData}
              cardWidth={CARD_WIDTH}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
}
