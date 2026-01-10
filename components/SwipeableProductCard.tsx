import React, { useState } from 'react';
import { View, Text, Image, Dimensions, Modal, TouchableOpacity, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X } from 'lucide-react-native';
import { Product } from '@/contexts/LikesContext';
import { useCart } from '@/contexts/CartContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const VERTICAL_SWIPE_THRESHOLD = SCREEN_HEIGHT * 0.15;

interface SwipeableProductCardProps {
    product: Product;
    onLike: () => void;
    onSkip: () => void;
    onViewDetails: () => void;
    onAddToCart: (size: string) => void;
    isFirst?: boolean;
}

export default function SwipeableProductCard({
    product,
    onLike,
    onSkip,
    onViewDetails,
    onAddToCart,
    isFirst = true,
}: SwipeableProductCardProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const { addToCart } = useCart();

    const mainImage = product.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
    const thumbnails = product.product_images.slice(0, 3).map(img => img.image_url);
    while (thumbnails.length < 3) thumbnails.push(mainImage);

    const resetPosition = () => {
        'worklet';
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    };

    const handleLike = () => {
        onLike();
    };

    const handleSkip = () => {
        onSkip();
    };

    const handleViewDetails = () => {
        onViewDetails();
    };

    const handleAddToCart = () => {
        setShowSizeModal(true);
    };

    const confirmAddToCart = async () => {
        await addToCart(product, selectedSize);
        onAddToCart(selectedSize);
        setShowSizeModal(false);
        Alert.alert('Added to Cart', `${product.name} (Size: ${selectedSize}) has been added to your bag.`);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX * 0.8; // Reduced movement
            translateY.value = event.translationY * 0.5; // Reduced vertical movement
        })
        .onEnd((event) => {
            const { translationX, translationY, velocityX, velocityY } = event;

            if (Math.abs(translationX) > Math.abs(translationY)) {
                if (translationX > SWIPE_THRESHOLD || velocityX > 800) {
                    // Swipe right - Like (quick fade out)
                    translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
                        runOnJS(handleLike)();
                    });
                } else if (translationX < -SWIPE_THRESHOLD || velocityX < -800) {
                    // Swipe left - Skip
                    translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
                        runOnJS(handleSkip)();
                    });
                } else {
                    resetPosition();
                }
            } else {
                if (translationY < -VERTICAL_SWIPE_THRESHOLD || velocityY < -800) {
                    // Swipe up - View details (immediate, no animation)
                    runOnJS(handleViewDetails)();
                    resetPosition();
                } else if (translationY > VERTICAL_SWIPE_THRESHOLD || velocityY > 800) {
                    // Swipe down - Add to cart
                    runOnJS(handleAddToCart)();
                    resetPosition();
                } else {
                    resetPosition();
                }
            }
        });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    // Subtle indicator opacity (smaller icons, less prominent)
    const likeIndicatorStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD * 0.5],
            [0, 0.8],
            Extrapolation.CLAMP
        ),
    }));

    const skipIndicatorStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD * 0.5, 0],
            [0.8, 0],
            Extrapolation.CLAMP
        ),
    }));

    if (!isFirst) {
        return (
            <View
                className="absolute rounded-3xl overflow-hidden bg-white"
                style={{
                    width: SCREEN_WIDTH - 32,
                    height: SCREEN_HEIGHT - 280,
                    transform: [{ scale: 0.98 }],
                    top: 5,
                }}
            >
                <Image source={{ uri: mainImage }} className="w-full h-full" resizeMode="cover" />
            </View>
        );
    }

    return (
        <>
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    className="absolute rounded-3xl overflow-hidden bg-white shadow-lg"
                    style={[
                        {
                            width: SCREEN_WIDTH - 32,
                            height: SCREEN_HEIGHT - 280,
                        },
                        cardStyle,
                    ]}
                >
                    {/* Main Product Image */}
                    <Image source={{ uri: mainImage }} className="w-full h-full" resizeMode="cover" />

                    {/* Thumbnail Strip */}
                    <View className="absolute right-3 top-3 gap-2">
                        {thumbnails.map((uri, index) => (
                            <TouchableOpacity
                                key={index}
                                className="w-12 h-16 rounded-lg overflow-hidden border-2 border-white/70"
                            >
                                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Small Like Indicator (top right corner) */}
                    <Animated.View
                        className="absolute top-4 left-4 bg-green-500 rounded-full p-3"
                        style={likeIndicatorStyle}
                    >
                        <Heart size={24} color="#fff" fill="#fff" strokeWidth={2} />
                    </Animated.View>

                    {/* Small Skip Indicator (top left corner) */}
                    <Animated.View
                        className="absolute top-4 right-16 bg-red-500 rounded-full p-3"
                        style={skipIndicatorStyle}
                    >
                        <X size={24} color="#fff" strokeWidth={2} />
                    </Animated.View>

                    {/* Bottom Info Card */}
                    <View className="absolute bottom-0 left-0 right-0">
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} className="p-4">
                            <View className="bg-white rounded-2xl p-4">
                                {/* Brand */}
                                <View className="flex-row items-center mb-2">
                                    <View className="w-7 h-7 rounded-full bg-gray-200 mr-2" />
                                    <Text className="text-xs font-semibold text-gray-500">{product.brand}</Text>
                                </View>

                                {/* Product Info */}
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="flex-1 text-base font-bold text-gray-900" numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text className="text-lg font-bold text-gray-900 ml-3">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </Text>
                                </View>

                                {/* Swipe Hints - Simplified */}
                                <View className="flex-row justify-center gap-6 pt-2 border-t border-gray-100">
                                    <Text className="text-xs text-gray-400">← Skip</Text>
                                    <Text className="text-xs text-gray-400">↑ Details</Text>
                                    <Text className="text-xs text-gray-400">Like →</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </Animated.View>
            </GestureDetector>

            {/* Size Selection Modal */}
            <Modal
                visible={showSizeModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSizeModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <Text className="text-xl font-bold text-center mb-5">Select Size</Text>
                        <View className="flex-row justify-center gap-3 mb-6">
                            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => setSelectedSize(size)}
                                    className={`px-5 py-3 rounded-full border ${selectedSize === size
                                        ? 'bg-black border-black'
                                        : 'bg-white border-gray-300'
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-semibold ${selectedSize === size ? 'text-white' : 'text-gray-700'
                                            }`}
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 py-4 rounded-2xl border border-gray-300 items-center"
                                onPress={() => setShowSizeModal(false)}
                            >
                                <Text className="text-base font-semibold text-gray-700">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 py-4 rounded-2xl bg-[#E8B298] items-center"
                                onPress={confirmAddToCart}
                            >
                                <Text className="text-base font-semibold text-gray-900">Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
