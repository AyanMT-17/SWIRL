import React, { useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { HeartIcon as HeartIconOutline, XMarkIcon, ShareIcon, StarIcon as StarIconOutline } from 'react-native-heroicons/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { Product } from '@/contexts/LikesContext';
import { useCart } from '@/contexts/CartContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// Responsive scale factor
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Panel heights
const COLLAPSED_PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.13);
const EXPANDED_PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.36);

// Responsive sizes
const CARD_HEIGHT = Math.round(SCREEN_HEIGHT * 0.702);
const THUMBNAIL_WIDTH = Math.round(48 * scale);
const THUMBNAIL_HEIGHT = Math.round(56 * scale);
const AVATAR_SIZE = Math.round(32 * scale);
const USER_AVATAR_SIZE = Math.round(40 * scale);
const SHARE_BUTTON_SIZE = Math.round(40 * scale);
const ICON_SIZE_SM = Math.round(12 * scale);
const ICON_SIZE_MD = Math.round(14 * scale);
const ICON_SIZE_LG = Math.round(18 * scale);
const ICON_SIZE_XL = Math.round(22 * scale);
const SIZE_BUTTON_SIZE = Math.round(40 * scale);

interface SwipeableProductCardProps {
    product: Product;
    onLike: () => void;
    onSkip: () => void;
    onViewDetails: () => void;
    onAddToCart: (size: string) => void;
    onBuyNow: (size: string) => void;
    isFirst?: boolean;
}

export default function SwipeableProductCard({
    product,
    onLike,
    onSkip,
    onViewDetails,
    onAddToCart,
    onBuyNow,
    isFirst = true,
}: SwipeableProductCardProps) {
    const translateX = useSharedValue(0);
    const panelHeight = useSharedValue(COLLAPSED_PANEL_HEIGHT);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const { addToCart } = useCart();

    const mainImage = product.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
    const thumbnails = product.product_images.slice(0, 4).map(img => img.image_url);
    while (thumbnails.length < 4) thumbnails.push(mainImage);

    const handleLike = () => {
        onLike();
    };

    const handleSkip = () => {
        onSkip();
    };

    const expandPanel = () => {
        setIsExpanded(true);
        panelHeight.value = withTiming(EXPANDED_PANEL_HEIGHT, { duration: 300 });
    };

    const collapsePanel = () => {
        setIsExpanded(false);
        panelHeight.value = withTiming(COLLAPSED_PANEL_HEIGHT, { duration: 300 });
    };

    const confirmAddToCart = async () => {
        await addToCart(product, selectedSize);
        onAddToCart(selectedSize);
        Alert.alert('Added to Cart', `${product.name} (Size: ${selectedSize}) has been added to your bag.`);
    };

    const handleBuyNow = () => {
        onBuyNow(selectedSize);
    };

    // Main card pan gesture
    const panGesture = Gesture.Pan()
        .onEnd((event) => {
            const { translationX, translationY, velocityX, velocityY } = event;

            const VERTICAL_THRESHOLD = SCREEN_HEIGHT * 0.2;

            // Swipe down - Add to cart (when panel is collapsed)
            if (!isExpanded && (translationY > VERTICAL_THRESHOLD || velocityY > 600)) {
                runOnJS(setShowSizeModal)(true);
                return;
            }

            // Horizontal swipe detection
            if (Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 800) {
                if (translationX > 0) {
                    translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
                        runOnJS(handleLike)();
                    });
                } else {
                    translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
                        runOnJS(handleSkip)();
                    });
                }
            }
        });

    // Panel gesture for vertical swipes
    const panelGesture = Gesture.Pan()
        .onEnd((event) => {
            const { translationY, velocityY } = event;

            // Swipe up to expand
            if (translationY < -50 || velocityY < -500) {
                runOnJS(expandPanel)();
            }
            // Swipe down to collapse
            else if (translationY > 50 || velocityY > 500) {
                runOnJS(collapsePanel)();
            }
        });

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const likeIndicatorStyle = useAnimatedStyle(() => ({
        opacity: translateX.value > 0 ? Math.min(translateX.value / (SWIPE_THRESHOLD * 0.5), 0.8) : 0,
    }));

    const skipIndicatorStyle = useAnimatedStyle(() => ({
        opacity: translateX.value < 0 ? Math.min(-translateX.value / (SWIPE_THRESHOLD * 0.5), 0.8) : 0,
    }));

    const panelAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: panelHeight.value,
        };
    });

    // Image container shrinks from bottom as panel expands upward
    const imageContainerStyle = useAnimatedStyle(() => {
        const imageHeight = interpolate(
            panelHeight.value,
            [COLLAPSED_PANEL_HEIGHT, EXPANDED_PANEL_HEIGHT],
            [CARD_HEIGHT - COLLAPSED_PANEL_HEIGHT, CARD_HEIGHT - EXPANDED_PANEL_HEIGHT],
            Extrapolation.CLAMP
        );
        return {
            height: imageHeight,
        };
    });

    const expandedContentOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            panelHeight.value,
            [COLLAPSED_PANEL_HEIGHT, COLLAPSED_PANEL_HEIGHT + 50, EXPANDED_PANEL_HEIGHT],
            [0, 0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const collapsedContentOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            panelHeight.value,
            [COLLAPSED_PANEL_HEIGHT, COLLAPSED_PANEL_HEIGHT + 80, EXPANDED_PANEL_HEIGHT],
            [1, 0, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    if (!isFirst) {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 24 * scale,
                    width: SCREEN_WIDTH,
                    height: CARD_HEIGHT,
                    transform: [{ scale: 0.95 }],
                    zIndex: -1,
                    opacity: 1, // Keep visible
                }}
                pointerEvents="none"
            >
                <View
                    className="bg-[#FDFFF2]"
                    style={{
                        width: SCREEN_WIDTH,
                        height: CARD_HEIGHT,
                        borderRadius: Math.round(32 * scale),
                        overflow: 'hidden',
                        flexDirection: 'column',
                        // Add shadow to separate from card behind if any
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <View className="bg-white relative" style={{ height: SCREEN_HEIGHT * 0.54 }}>
                        <Image
                            source={{ uri: mainImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {/* Dim overlay */}
                        <View className="absolute inset-0 bg-black/5" />
                    </View>

                    {/* Simplified Info Panel */}
                    <View style={{ paddingHorizontal: 16 * scale, paddingTop: 12 * scale, backgroundColor: '#FDFFF2', flex: 1 }}>
                        <View className="flex-row items-center" style={{ marginBottom: 4 * scale, opacity: 0.6 }}>
                            <View style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, backgroundColor: '#d1d5db', marginRight: 8 * scale }} />
                            <View style={{ height: 14 * scale, width: 80 * scale, backgroundColor: '#d1d5db', borderRadius: 4 }} />
                        </View>
                        <View className="flex-row justify-between items-center" style={{ opacity: 0.6 }}>
                            <View style={{ height: 20 * scale, width: 150 * scale, backgroundColor: '#d1d5db', borderRadius: 4 }} />
                            <View style={{ height: 20 * scale, width: 60 * scale, backgroundColor: '#d1d5db', borderRadius: 4 }} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const formattedPrice = `₹ ${product.price?.toLocaleString('en-IN') || '19,999'}`;

    return (
        <>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ width: SCREEN_WIDTH, height: CARD_HEIGHT }, cardStyle]}>
                    {/* Main Card Container with fixed height */}
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            height: CARD_HEIGHT,
                            flexDirection: 'column',
                            gap: 4, // Same gap as between header and card
                        }}
                    >
                        {/* Image Section - Shrinks from bottom */}
                        <Animated.View
                            className="bg-white relative"
                            style={[imageContainerStyle, { borderRadius: Math.round(32 * scale), overflow: 'hidden' }]}
                        >
                            {/* Main Product Image */}
                            <Image
                                source={{ uri: mainImage }}
                                style={{ width: '100%', height: CARD_HEIGHT - COLLAPSED_PANEL_HEIGHT }}
                                resizeMode="cover"
                            />

                            {/* Thumbnails on Right */}
                            <View style={{ position: 'absolute', right: 12 * scale, top: 16 * scale, gap: 8 * scale }}>
                                {thumbnails.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            width: THUMBNAIL_WIDTH,
                                            height: THUMBNAIL_HEIGHT,
                                            borderRadius: 8 * scale,
                                            overflow: 'hidden',
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                            backgroundColor: 'white',
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{ uri }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Share Button */}
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    bottom: 16 * scale,
                                    right: 16 * scale,
                                    width: SHARE_BUTTON_SIZE,
                                    height: SHARE_BUTTON_SIZE,
                                    borderRadius: SHARE_BUTTON_SIZE / 2,
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                activeOpacity={0.7}
                            >
                                <ShareIcon size={ICON_SIZE_LG} color="#666" />
                            </TouchableOpacity>

                            {/* Like Indicator */}
                            <Animated.View
                                style={[{
                                    position: 'absolute',
                                    top: 16 * scale,
                                    left: 16 * scale,
                                    backgroundColor: '#22c55e',
                                    borderRadius: 9999,
                                    padding: 12 * scale,
                                    zIndex: 10,
                                }, likeIndicatorStyle]}
                            >
                                <HeartIconSolid size={Math.round(24 * scale)} color="#fff" />
                            </Animated.View>

                            {/* Skip Indicator */}
                            <Animated.View
                                style={[{
                                    position: 'absolute',
                                    top: 16 * scale,
                                    left: 64 * scale,
                                    backgroundColor: '#ef4444',
                                    borderRadius: 9999,
                                    padding: 12 * scale,
                                    zIndex: 10,
                                }, skipIndicatorStyle]}
                            >
                                <XMarkIcon size={Math.round(24 * scale)} color="#fff" strokeWidth={2} />
                            </Animated.View>
                        </Animated.View>

                        {/* Product Info Panel - Expands upward, anchored at bottom */}
                        <GestureDetector gesture={panelGesture}>
                            <Animated.View
                                style={[{
                                    backgroundColor: '#FDFFF2',
                                    paddingHorizontal: 16 * scale,
                                    borderRadius: Math.round(32 * scale),
                                    overflow: 'hidden',
                                }, panelAnimatedStyle]}
                            >
                                {/* Collapsed View */}
                                <Animated.View style={[{ position: 'absolute', left: 16 * scale, right: 16 * scale, top: 12 * scale }, collapsedContentOpacity]}>
                                    {/* Brand Row with Heart */}
                                    <View className="flex-row items-center justify-between" style={{ marginBottom: 4 * scale }}>
                                        <View className="flex-row items-center flex-1">
                                            <View
                                                style={{
                                                    width: AVATAR_SIZE,
                                                    height: AVATAR_SIZE,
                                                    borderRadius: AVATAR_SIZE / 2,
                                                    backgroundColor: '#1f2937',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8 * scale,
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 12 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold' }}>
                                                    {product.brand?.charAt(0) || 'C'}
                                                </Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ fontSize: 14 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>
                                                    {product.brand || 'Cole Buxton'}
                                                </Text>
                                                <Text style={{ fontSize: 11 * scale, color: '#9ca3af' }}>@{(product.brand || 'cole_buxton').toLowerCase().replace(' ', '_')}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity>
                                            <HeartIconOutline size={ICON_SIZE_XL} color="#d1d5db" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Product Name + Price */}
                                    <View className="flex-row items-center justify-between" style={{ marginBottom: 4 * scale }}>
                                        <Text style={{ fontSize: 16 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827', flex: 1, marginRight: 8 * scale }} numberOfLines={1}>
                                            {product.name || 'Les 3 Vallees Hoodie'}
                                        </Text>
                                        <Text style={{ fontSize: 16 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827' }}>
                                            {formattedPrice}
                                        </Text>
                                    </View>

                                    {/* Rating */}
                                    <View className="flex-row items-center">
                                        <StarIconSolid size={ICON_SIZE_SM} color="#000" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#000" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#000" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#000" />
                                        <StarIconOutline size={ICON_SIZE_SM} color="#ccc" />
                                        <Text style={{ fontSize: 12 * scale, color: '#9ca3af', marginLeft: 4 * scale }}>4.0</Text>
                                    </View>
                                </Animated.View>

                                {/* Expanded View */}
                                <Animated.View style={[{ flex: 1 }, expandedContentOpacity]}>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        className="flex-1"
                                        bounces={false}
                                        overScrollMode="never"
                                    >
                                        {/* Brand Row */}
                                        <View className="flex-row items-center justify-between" style={{ marginBottom: 12 * scale, marginTop: 12 * scale }}>
                                            <View className="flex-row items-center">
                                                <View
                                                    style={{
                                                        width: AVATAR_SIZE,
                                                        height: AVATAR_SIZE,
                                                        borderRadius: AVATAR_SIZE / 2,
                                                        backgroundColor: '#1f2937',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: 8 * scale,
                                                    }}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 12 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold' }}>
                                                        {product.brand?.charAt(0) || 'C'}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 14 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>
                                                        {product.brand || 'Cole Buxton'}
                                                    </Text>
                                                    <Text style={{ fontSize: 12 * scale, color: '#9ca3af' }}>@{(product.brand || 'cole_buxton').toLowerCase().replace(' ', '_')}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity>
                                                <HeartIconOutline size={ICON_SIZE_XL} color="#ccc" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Product Name & Price */}
                                        <View className="flex-row items-start justify-between" style={{ marginBottom: 8 * scale }}>
                                            <Text style={{ fontSize: 20 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827', flex: 1, marginRight: 16 * scale }} numberOfLines={2}>
                                                {product.name || 'Les 3 Vallees Hoodie'}
                                            </Text>
                                            <Text style={{ fontSize: 20 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827' }}>
                                                {formattedPrice}
                                            </Text>
                                        </View>

                                        {/* Rating */}
                                        <View className="flex-row items-center" style={{ marginBottom: 16 * scale }}>
                                            <StarIconSolid size={ICON_SIZE_MD} color="#000" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#000" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#000" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#000" />
                                            <StarIconOutline size={ICON_SIZE_MD} color="#ccc" />
                                            <Text style={{ fontSize: 12 * scale, color: '#9ca3af', marginLeft: 8 * scale }}>4.0</Text>
                                        </View>

                                        {/* Size Selection */}
                                        <View className="flex-row" style={{ gap: 8 * scale, marginBottom: 16 * scale }}>
                                            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                                <TouchableOpacity
                                                    key={size}
                                                    onPress={() => setSelectedSize(size)}
                                                    style={{
                                                        width: SIZE_BUTTON_SIZE,
                                                        height: SIZE_BUTTON_SIZE,
                                                        borderRadius: SIZE_BUTTON_SIZE / 2,
                                                        borderWidth: 1,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: selectedSize === size ? 'black' : 'white',
                                                        borderColor: selectedSize === size ? 'black' : '#d1d5db',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 14 * scale, fontWeight: '500', fontFamily: 'DMSans_500Medium', color: selectedSize === size ? 'white' : '#374151' }}>
                                                        {size}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        {/* Description */}
                                        <Text style={{ fontSize: 14 * scale, color: '#4b5563', lineHeight: 20 * scale, marginBottom: 16 * scale }} numberOfLines={4}>
                                            {product.description || 'The Les 3 Vallees hoodie has been crafted from 500gsm American brushed cotton fleece in our classic hoodie silhouette with a slight cropped body, double layer hood and single needle coverstitch detailing. Featuring our brand new 3...'}
                                        </Text>

                                        {/* Action Buttons */}
                                        <View className="flex-row" style={{ gap: 8 * scale, marginBottom: 16 * scale }}>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 12 * scale,
                                                    paddingHorizontal: 8 * scale,
                                                    borderRadius: 16 * scale,
                                                    borderWidth: 1,
                                                    borderColor: '#d1d5db',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'white',
                                                }}
                                                onPress={confirmAddToCart}
                                            >
                                                <Text style={{ fontSize: 14 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }} numberOfLines={1}>Add to Cart</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 12 * scale,
                                                    paddingHorizontal: 8 * scale,
                                                    borderRadius: 16 * scale,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#E8B298',
                                                }}
                                                onPress={handleBuyNow}
                                            >
                                                <Text style={{ fontSize: 14 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }} numberOfLines={1}>Buy Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </Animated.View>
                            </Animated.View>
                        </GestureDetector>
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
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24 * scale, borderTopRightRadius: 24 * scale, padding: 24 * scale }}>
                        <Text style={{ fontSize: 20 * scale, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', textAlign: 'center', marginBottom: 20 * scale }}>Select Size</Text>
                        <View className="flex-row justify-center" style={{ gap: 12 * scale, marginBottom: 24 * scale }}>
                            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => setSelectedSize(size)}
                                    style={{
                                        paddingHorizontal: 20 * scale,
                                        paddingVertical: 12 * scale,
                                        borderRadius: 9999,
                                        borderWidth: 1,
                                        backgroundColor: selectedSize === size ? 'black' : 'white',
                                        borderColor: selectedSize === size ? 'black' : '#d1d5db',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14 * scale,
                                            fontWeight: '600',
                                            fontFamily: 'DMSans_600SemiBold',
                                            color: selectedSize === size ? 'white' : '#374151',
                                        }}
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="flex-row" style={{ gap: 12 * scale }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 16 * scale,
                                    borderRadius: 16 * scale,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db',
                                    alignItems: 'center',
                                }}
                                onPress={() => setShowSizeModal(false)}
                            >
                                <Text style={{ fontSize: 16 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#374151' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 16 * scale,
                                    borderRadius: 16 * scale,
                                    backgroundColor: '#E8B298',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setShowSizeModal(false);
                                    confirmAddToCart();
                                }}
                            >
                                <Text style={{ fontSize: 16 * scale, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}