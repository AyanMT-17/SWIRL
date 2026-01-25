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

const SWIPE_THRESHOLD = 80;
const HEADER_BORDER_RADIUS = 24;
const FEED_BORDER_RADIUS = 24;

interface SwipeableCartItemProps {
  item: CartItem;
  onRemove: () => void;
  onBuyNow: () => void;
}

// Fixed action button dimensions
const ACTION_BUTTON_WIDTH = 112;
const ACTION_BUTTON_HEIGHT = 116;
const ACTION_BUTTON_RADIUS = 24;
const ACTION_BUTTON_GAP = 16;

function SwipeableCartItem({ item, onRemove, onBuyNow }: SwipeableCartItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Calculate the swipe distance needed to reveal the action button with gap
  const SWIPE_DISTANCE = ACTION_BUTTON_WIDTH + ACTION_BUTTON_GAP;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Clamp the drag distance to the action button width + gap
        const dx = Math.max(-SWIPE_DISTANCE, Math.min(SWIPE_DISTANCE, gestureState.dx));
        translateX.setValue(dx);

        if (dx < -20) {
          setSwipeDirection('left');
        } else if (dx > 20) {
          setSwipeDirection('right');
        } else {
          setSwipeDirection(null);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swiped left - show Buy Now
          Animated.spring(translateX, {
            toValue: -SWIPE_DISTANCE,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          setSwipeDirection('left');
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped right - show Remove
          Animated.spring(translateX, {
            toValue: SWIPE_DISTANCE,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          setSwipeDirection('right');
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
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
      bounciness: 0,
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

  // Calculate opacity for action buttons based on swipe direction
  const buyNowOpacity = translateX.interpolate({
    inputRange: [-SWIPE_DISTANCE, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const removeOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="relative mb-3" style={{ minHeight: ACTION_BUTTON_HEIGHT }}>
      {/* Remove button - Left side (shown when swiped right) - Separate component with gap */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ACTION_BUTTON_WIDTH,
          height: ACTION_BUTTON_HEIGHT,
          opacity: removeOpacity,
        }}
      >
        <TouchableOpacity
          onPress={handleRemove}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: '#EF4444',
            borderRadius: ACTION_BUTTON_RADIUS,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Remove</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Buy Now button - Right side (shown when swiped left) - Separate component with gap */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: ACTION_BUTTON_WIDTH,
          height: ACTION_BUTTON_HEIGHT,
          opacity: buyNowOpacity,
        }}
      >
        <TouchableOpacity
          onPress={handleBuyNow}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: '#E8B298',
            borderRadius: ACTION_BUTTON_RADIUS,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 }}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main card content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          backgroundColor: '#F7F8DB',
          borderRadius: ACTION_BUTTON_RADIUS,
          padding: 12,
          flexDirection: 'row',
          minHeight: ACTION_BUTTON_HEIGHT,
        }}
      >
        {/* Product Image */}
        <Image
          source={{
            uri:
              item.product.product_images[0]?.image_url ||
              'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
          }}
          style={{
            width: 64,
            height: 80,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
          <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 2 }}>
            {item.product.brand}
          </Text>
          <Text
            style={{ color: '#1A1A1A', fontWeight: '600', fontSize: 14, marginBottom: 4 }}
            numberOfLines={1}
          >
            {item.product.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 }}>
              ₹{item.product.price.toLocaleString('en-IN')}
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12, textDecorationLine: 'line-through' }}>
              ₹{originalPrice.toLocaleString('en-IN')}
            </Text>
            <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ color: '#DC2626', fontSize: 10, fontWeight: '600' }}>
                -{discountPercent}%
              </Text>
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
    <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: 94 }}>
      {/* Floating Header - Separate component */}
      <View
        style={{
          /* Floating Header - Separate component */
          backgroundColor: '#FDFFF2',
          zIndex: 50,
          overflow: 'hidden',
          borderRadius: HEADER_BORDER_RADIUS,
          paddingTop: Math.max(insets.top, 44),
          paddingBottom: 16,
          paddingHorizontal: 16,
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
          marginTop: 3,
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
            bounces={false}
            overScrollMode="never"
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
