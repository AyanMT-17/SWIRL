import React, { useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
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
import { HeartIcon as HeartIconOutline, XMarkIcon, StarIcon as StarIconOutline } from 'react-native-heroicons/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/contexts/LikesContext';
import { useCart } from '@/contexts/CartContext';
import { useRecommendation } from '@/contexts/RecommendationContext';
import AddIcon from './icons/AddIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// Fixed dimensions
const COLLAPSED_PANEL_HEIGHT = 100;
const EXPANDED_PANEL_HEIGHT = SCREEN_HEIGHT * 0.45;

// Card height fills available space minus header (approx 120) and tab bar (approx 85)
const CARD_HEIGHT = SCREEN_HEIGHT - 120 - 90 - 36;

const THUMBNAIL_WIDTH = 48;
const THUMBNAIL_HEIGHT = 56;
const AVATAR_SIZE = 32;
const SHARE_BUTTON_SIZE = 40;
const ICON_SIZE_SM = 12;
const ICON_SIZE_MD = 14;
const ICON_SIZE_XL = 22;
const SIZE_BUTTON_SIZE = 40;

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
    const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
    const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const { addToCart } = useCart();
    const { handleSwipeRight, collections, createCollection, addToCollection } = useRecommendation();

    const mainImage = product.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
    const thumbnails = product.product_images.slice(0, 4).map(img => img.image_url);
    while (thumbnails.length < 4) thumbnails.push(mainImage);

    // Collection modal constants
    const COLLECTION_CARD_WIDTH = (SCREEN_WIDTH - 64) / 3;

    const handleAddToCollectionPress = () => {
        setShowAddToCollectionModal(true);
    };

    const handleCreateCollection = async () => {
        if (collectionName.trim()) {
            await createCollection(collectionName, product as any);
            setCollectionName('');
            setShowNewCollectionModal(false);
            setShowAddToCollectionModal(false);
            Alert.alert('Created!', `Collection "${collectionName}" created with ${product.name}.`);
        }
    };

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

    // Main card pan gesture - handles both horizontal swipes and vertical swipes
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // Card follows finger during drag
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const { translationX: tx, translationY, velocityX, velocityY } = event;

            const VERTICAL_THRESHOLD = SCREEN_HEIGHT * 0.2;
            const VERTICAL_SWIPE_THRESHOLD = 50;

            // Check if this is primarily a vertical or horizontal gesture
            const isVerticalGesture = Math.abs(translationY) > Math.abs(tx);

            if (isVerticalGesture) {
                // Reset horizontal position on vertical swipe (smooth, no bounce)
                translateX.value = withTiming(0, { duration: 200 });

                // Swipe up to expand panel (works anywhere on the card)
                if (translationY < -VERTICAL_SWIPE_THRESHOLD || velocityY < -500) {
                    runOnJS(expandPanel)();
                    return;
                }
                // Swipe down - collapse panel if expanded, or add to cart if collapsed
                else if (translationY > VERTICAL_SWIPE_THRESHOLD || velocityY > 500) {
                    if (isExpanded) {
                        runOnJS(collapsePanel)();
                    } else if (translationY > VERTICAL_THRESHOLD || velocityY > 600) {
                        // Add to cart only with larger swipe when panel is collapsed
                        runOnJS(setShowSizeModal)(true);
                    }
                    return;
                }
            }

            // Horizontal swipe detection
            if (Math.abs(tx) > SWIPE_THRESHOLD || Math.abs(velocityX) > 800) {
                if (tx > 0) {
                    translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                        runOnJS(handleLike)();
                    });
                } else {
                    translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                        runOnJS(handleSkip)();
                    });
                }
            } else {
                // Smooth snap back to center (no bounce/bubble effect)
                translateX.value = withTiming(0, { duration: 200 });
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

    // Card style with rotation for parabolic effect
    const cardStyle = useAnimatedStyle(() => {
        // Rotation based on horizontal position (max ±6 degrees for subtle tilt)
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-1, 0, 1],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

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
                    top: 24,
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
                        borderRadius: 32,
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
                    <View className="bg-white relative" style={{ height: CARD_HEIGHT - COLLAPSED_PANEL_HEIGHT }}>
                        <Image
                            source={{ uri: mainImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {/* Dim overlay */}
                        <View className="absolute inset-0 bg-black/5" />
                    </View>

                    {/* Simplified Info Panel */}
                    <View style={{ paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#FDFFF2', flex: 1 }}>
                        <View className="flex-row items-center" style={{ marginBottom: 4, opacity: 0.6 }}>
                            <View style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, backgroundColor: '#d1d5db', marginRight: 8 }} />
                            <View style={{ height: 14, width: 80, backgroundColor: '#d1d5db', borderRadius: 4 }} />
                        </View>
                        <View className="flex-row justify-between items-center" style={{ opacity: 0.6 }}>
                            <View style={{ height: 20, width: 150, backgroundColor: '#d1d5db', borderRadius: 4 }} />
                            <View style={{ height: 20, width: 60, backgroundColor: '#d1d5db', borderRadius: 4 }} />
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
                            style={[imageContainerStyle, { borderRadius: 32, overflow: 'hidden' }]}
                        >
                            {/* Main Product Image */}
                            <Image
                                source={{ uri: mainImage }}
                                style={{ width: '100%', height: CARD_HEIGHT - COLLAPSED_PANEL_HEIGHT }}
                                resizeMode="cover"
                            />

                            {/* Thumbnails on Right */}
                            <View style={{ position: 'absolute', right: 12, top: 16, gap: 8 }}>
                                {thumbnails.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            width: THUMBNAIL_WIDTH,
                                            height: THUMBNAIL_HEIGHT,
                                            borderRadius: 8,
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

                            {/* Add to Collection Button */}
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,
                                    // Remove background and shadow since icon has it
                                    // But keeping size container if needed?
                                    // AddIcon size is 40. SHARE_BUTTON_SIZE is 40*scale.
                                }}
                                activeOpacity={0.7}
                                onPress={handleAddToCollectionPress}
                            >
                                <AddIcon size={SHARE_BUTTON_SIZE} />
                            </TouchableOpacity>

                            {/* Like Indicator */}
                            <Animated.View
                                style={[{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    backgroundColor: '#22c55e',
                                    borderRadius: 9999,
                                    padding: 12,
                                    zIndex: 10,
                                }, likeIndicatorStyle]}
                            >
                                <HeartIconSolid size={24} color="#fff" />
                            </Animated.View>

                            {/* Skip Indicator */}
                            <Animated.View
                                style={[{
                                    position: 'absolute',
                                    top: 16,
                                    left: 64,
                                    backgroundColor: '#ef4444',
                                    borderRadius: 9999,
                                    padding: 12,
                                    zIndex: 10,
                                }, skipIndicatorStyle]}
                            >
                                <XMarkIcon size={24} color="#fff" strokeWidth={2} />
                            </Animated.View>
                        </Animated.View>

                        {/* Product Info Panel - Expands upward, anchored at bottom */}
                        <GestureDetector gesture={panelGesture}>
                            <Animated.View
                                style={[{
                                    backgroundColor: '#FDFFF2',
                                    paddingHorizontal: 16,
                                    borderRadius: 32,
                                    overflow: 'hidden',
                                }, panelAnimatedStyle]}
                            >
                                {/* Collapsed View */}
                                <Animated.View style={[{ position: 'absolute', left: 16, right: 16, top: 12 }, collapsedContentOpacity]}>
                                    {/* Brand Row with Heart */}
                                    <View className="flex-row items-center justify-between" style={{ marginBottom: 4 }}>
                                        <View className="flex-row items-center flex-1">
                                            <View
                                                style={{
                                                    width: AVATAR_SIZE,
                                                    height: AVATAR_SIZE,
                                                    borderRadius: AVATAR_SIZE / 2,
                                                    backgroundColor: '#1f2937',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 8,
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', fontFamily: 'DMSans_700Bold' }}>
                                                    {product.brand?.charAt(0) || 'C'}
                                                </Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>
                                                    {product.brand || 'Cole Buxton'}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity>
                                            <HeartIconOutline size={ICON_SIZE_XL} color="#d1d5db" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Product Name + Price */}
                                    <View className="flex-row items-center justify-between" style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827', flex: 1, marginRight: 8 }} numberOfLines={1}>
                                            {product.name || 'Les 3 Vallees Hoodie'}
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827' }}>
                                            {formattedPrice}
                                        </Text>
                                    </View>

                                    {/* Rating */}
                                    <View className="flex-row items-center">
                                        <StarIconSolid size={ICON_SIZE_SM} color="#959595" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#959595" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#959595" />
                                        <StarIconSolid size={ICON_SIZE_SM} color="#959595" />
                                        <StarIconOutline size={ICON_SIZE_SM} color="#ccc" />
                                        <Text style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>4.0</Text>
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
                                        <View className="flex-row items-center justify-between" style={{ marginBottom: 12, marginTop: 12 }}>
                                            <View className="flex-row items-center">
                                                <View
                                                    style={{
                                                        width: AVATAR_SIZE,
                                                        height: AVATAR_SIZE,
                                                        borderRadius: AVATAR_SIZE / 2,
                                                        backgroundColor: '#1f2937',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: 8,
                                                    }}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', fontFamily: 'DMSans_700Bold' }}>
                                                        {product.brand?.charAt(0) || 'C'}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>
                                                        {product.brand || 'Cole Buxton'}
                                                    </Text>
                                                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>@{(product.brand || 'cole_buxton').toLowerCase().replace(' ', '_')}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity>
                                                <HeartIconOutline size={ICON_SIZE_XL} color="#ccc" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Product Name & Price */}
                                        <View className="flex-row items-start justify-between" style={{ marginBottom: 8 }}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827', flex: 1, marginRight: 16 }} numberOfLines={2}>
                                                {product.name || 'Les 3 Vallees Hoodie'}
                                            </Text>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', color: '#111827' }}>
                                                {formattedPrice}
                                            </Text>
                                        </View>

                                        {/* Rating */}
                                        <View className="flex-row items-center" style={{ marginBottom: 16 }}>
                                            <StarIconSolid size={ICON_SIZE_MD} color="#959595" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#959595" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#959595" />
                                            <StarIconSolid size={ICON_SIZE_MD} color="#959595" />
                                            <StarIconOutline size={ICON_SIZE_MD} color="#ccc" />
                                            <Text style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>4.0</Text>
                                        </View>

                                        {/* Size Selection */}
                                        <View className="flex-row" style={{ gap: 8, marginBottom: 14 }}>
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
                                                    <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'DMSans_500Medium', color: selectedSize === size ? 'white' : '#374151' }}>
                                                        {size}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        {/* Description */}
                                        <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 18, marginBottom: 10 }} numberOfLines={2}>
                                            {product.description || 'The Les 3 Vallees hoodie has been crafted from 500gsm American brushed cotton fleece in our classic hoodie silhouette with a slight cropped body, double layer hood and single needle coverstitch detailing. Featuring our brand new 3...'}
                                        </Text>

                                        {/* Action Buttons */}
                                        <View className="flex-row" style={{ gap: 8, marginTop: 12, marginBottom: 8 }}>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 8,
                                                    borderRadius: 16,
                                                    borderWidth: 1,
                                                    borderColor: '#d1d5db',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'white',
                                                }}
                                                onPress={confirmAddToCart}
                                            >
                                                <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }} numberOfLines={1}>Add to Cart</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 8,
                                                    borderRadius: 16,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#E8B298',
                                                }}
                                                onPress={handleBuyNow}
                                            >
                                                <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }} numberOfLines={1}>Buy Now</Text>
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
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', textAlign: 'center', marginBottom: 20 }}>Select Size</Text>
                        <View className="flex-row justify-center" style={{ gap: 12, marginBottom: 24 }}>
                            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => setSelectedSize(size)}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 12,
                                        borderRadius: 9999,
                                        borderWidth: 1,
                                        backgroundColor: selectedSize === size ? 'black' : 'white',
                                        borderColor: selectedSize === size ? 'black' : '#d1d5db',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
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
                        <View className="flex-row" style={{ gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 16,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db',
                                    alignItems: 'center',
                                }}
                                onPress={() => setShowSizeModal(false)}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#374151' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 16,
                                    borderRadius: 16,
                                    backgroundColor: '#E8B298',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setShowSizeModal(false);
                                    confirmAddToCart();
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add to Collection Modal */}
            <Modal
                visible={showAddToCollectionModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddToCollectionModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '60%' }}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity
                                onPress={() => setShowAddToCollectionModal(false)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <XMarkIcon size={22} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-base font-bold text-gray-900">Add to Collection</Text>
                            <TouchableOpacity
                                onPress={() => setShowNewCollectionModal(true)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <Ionicons name="add-outline" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Collections Grid */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap gap-3">
                                {collections.length === 0 ? (
                                    <View className="flex-1 items-center justify-center py-10">
                                        <Text className="text-gray-500 text-center mb-4">No collections yet</Text>
                                        <TouchableOpacity
                                            onPress={() => setShowNewCollectionModal(true)}
                                            className="bg-[#E8B298] px-6 py-3 rounded-xl"
                                        >
                                            <Text className="font-semibold text-gray-900">Create First Collection</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    collections.map((collection) => (
                                        <TouchableOpacity
                                            key={collection.id}
                                            className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                                            style={{ width: COLLECTION_CARD_WIDTH, height: COLLECTION_CARD_WIDTH * 1.2 }}
                                            onPress={async () => {
                                                await addToCollection(collection.id, product.id);
                                                setShowAddToCollectionModal(false);
                                                Alert.alert('Added!', `${product.name} added to "${collection.name}".`);
                                            }}
                                        >
                                            <Image
                                                source={{ uri: collection.image }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                            {/* Collection Name Label */}
                                            <View className="absolute bottom-0 left-0 right-0 bg-[#D4CFC4]/90 py-2 px-2">
                                                <Text className="text-xs font-semibold text-gray-800 text-center" numberOfLines={1}>
                                                    {collection.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* New Collection Modal */}
            <Modal
                visible={showNewCollectionModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowNewCollectionModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '55%' }}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity
                                onPress={() => setShowNewCollectionModal(false)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <XMarkIcon size={22} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-base font-bold text-gray-900">New Collection</Text>
                            <TouchableOpacity
                                className="bg-[#E8B298] px-4 py-2 rounded-lg"
                                onPress={handleCreateCollection}
                            >
                                <Text className="text-sm font-bold text-gray-900">Create</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Collection Image Preview */}
                        <View className="items-center mb-6">
                            <View className="bg-white rounded-2xl p-3 shadow-sm">
                                {product?.product_images[0]?.image_url ? (
                                    <Image
                                        source={{ uri: product.product_images[0].image_url }}
                                        className="w-28 h-32 rounded-xl"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-28 h-32 rounded-xl bg-gray-100 items-center justify-center">
                                        <Ionicons name="image-outline" size={32} color="#999" />
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Collection Name Input */}
                        <View className="mb-4">
                            <TextInput
                                value={collectionName}
                                onChangeText={setCollectionName}
                                placeholder="Collection Name"
                                placeholderTextColor="#9ca3af"
                                className="bg-white px-4 py-4 rounded-xl text-gray-900 text-base border border-gray-200"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}