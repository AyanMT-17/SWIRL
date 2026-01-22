import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart, CartItem } from '@/contexts/CartContext';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

const SWIPE_THRESHOLD = 80;
const HEADER_BORDER_RADIUS = Math.round(24 * scale);
const FEED_BORDER_RADIUS = Math.round(24 * scale);

interface SwipeableCartItemProps {
  item: CartItem;
  onRemove: () => void;
  onBuyNow: () => void;
}

function SwipeableCartItem({ item, onRemove, onBuyNow }: SwipeableCartItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
        if (gestureState.dx < -20) {
          setSwipeDirection('left');
        } else if (gestureState.dx > 20) {
          setSwipeDirection('right');
        } else {
          setSwipeDirection(null);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swiped left - show Buy Now
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped right - show Remove
          Animated.spring(translateX, {
            toValue: 100,
            useNativeDriver: true,
          }).start();
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setSwipeDirection(null);
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setSwipeDirection(null);
  };

  const handleBuyNow = () => {
    onBuyNow();
    resetPosition();
  };

  const handleRemove = () => {
    onRemove();
  };

  // Calculate original price (mock discount)
  const originalPrice = Math.round(item.product.price * 1.25);
  const discountPercent = Math.round((1 - item.product.price / originalPrice) * 100);

  return (
    <View className="relative mb-3 overflow-hidden rounded-2xl">
      {/* Background actions */}
      <View className="absolute inset-0 flex-row">
        {/* Remove button - Left side (shown when swiped right) */}
        <TouchableOpacity
          onPress={handleRemove}
          className="flex-1 bg-red-500 items-start justify-center pl-6"
        >
          <Text className="text-white font-bold text-base">Remove</Text>
        </TouchableOpacity>

        {/* Buy Now button - Right side (shown when swiped left) */}
        <TouchableOpacity
          onPress={handleBuyNow}
          className="flex-1 bg-[#E8B298] items-end justify-center pr-6"
        >
          <Text className="text-gray-900 font-bold text-base">Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Main card content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          backgroundColor: '#FDFFF2',
        }}
        className="flex-row p-3 rounded-2xl"
      >
        {/* Product Image */}
        <Image
          source={{
            uri:
              item.product.product_images[0]?.image_url ||
              'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
          }}
          className="w-16 h-20 rounded-xl"
          resizeMode="cover"
        />

        {/* Product Info */}
        <View className="flex-1 ml-3 justify-center">
          <Text className="text-gray-500 text-xs mb-0.5">{item.product.brand}</Text>
          <Text className="text-gray-900 font-semibold text-sm mb-1" numberOfLines={1}>
            {item.product.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-900 font-bold text-base">
              ₹{item.product.price.toLocaleString('en-IN')}
            </Text>
            <Text className="text-gray-400 text-xs line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </Text>
            <View className="bg-red-100 px-1.5 py-0.5 rounded">
              <Text className="text-red-600 text-[10px] font-semibold">-{discountPercent}%</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function Cart() {
  const { cartItems, removeFromCart, getCartTotal, isLoading } = useCart();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const total = getCartTotal();

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleBuyNow = (item: CartItem) => {
    // Placeholder - checkout functionality removed
    Alert.alert('Coming Soon', 'Checkout functionality will be available soon!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: Math.round(94 * heightScale) }}>
      {/* Floating Header - Separate component */}
      <View
        style={{
          backgroundColor: '#FDFFF2',
          zIndex: 50,
          overflow: 'hidden',
          borderRadius: HEADER_BORDER_RADIUS,
          paddingTop: Math.max(insets.top, Math.round(44 * heightScale)),
          paddingBottom: Math.round(16 * heightScale),
          paddingHorizontal: Math.round(16 * scale),
        }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ChevronLeftIcon size={24} color="black" strokeWidth={2} />
          </TouchableOpacity>
          <Text className="text-black text-xl font-bold ml-2">My Cart</Text>
        </View>
      </View>

      {/* Feed Section - Cart Items */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFFF2',
          marginTop: Math.round(3 * scale),
          borderRadius: FEED_BORDER_RADIUS,
          overflow: 'hidden',
        }}
      >
        {cartItems.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-6xl mb-4">🛒</Text>
            <Text className="text-gray-900 text-xl font-bold mb-2">Your cart is empty</Text>
            <Text className="text-gray-500 text-sm text-center">
              Add items to your cart to see them here
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="mt-6 bg-[#E8B298] px-8 py-3 rounded-full"
            >
              <Text className="text-gray-900 font-bold">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <SwipeableCartItem
                key={item.id}
                item={item}
                onRemove={() => handleRemoveItem(item.id)}
                onBuyNow={() => handleBuyNow(item)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
