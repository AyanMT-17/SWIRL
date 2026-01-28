import React, { useState } from 'react';
import { View, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Product } from '@/contexts/LikesContext';
import { useCart } from '@/contexts/CartContext';
import { useRecommendation } from '@/contexts/RecommendationContext';
import SizeSelectionModal from './swipeable-card/SizeSelectionModal';
import CollectionModals from './swipeable-card/CollectionModals';
import ProductInfoPanel from './swipeable-card/ProductInfoPanel';
import ImageGallery from './swipeable-card/ImageGallery';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// Fixed dimensions
const COLLAPSED_PANEL_HEIGHT = 100;

// Footer and spacing constants
const FOOTER_HEIGHT = 90;
const GAP_SPACING = 4; // Gap between header and card
const AVATAR_SIZE = 32;

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
    const insets = useSafeAreaInsets();
    const HEADER_HEIGHT = insets.top + 116;
    const BOTTOM_MARGIN = 8;
    const CARD_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - GAP_SPACING - FOOTER_HEIGHT - BOTTOM_MARGIN;

    const [contentHeight, setContentHeight] = useState(0);
    const MAX_ALLOWED_HEIGHT = CARD_HEIGHT * 0.6;
    const dynamicHeight = contentHeight > 0
        ? Math.min(contentHeight + 15, MAX_ALLOWED_HEIGHT)
        : CARD_HEIGHT * 0.45;

    const EXPANDED_PANEL_HEIGHT = dynamicHeight;

    const translateX = useSharedValue(0);
    const panelHeight = useSharedValue(COLLAPSED_PANEL_HEIGHT);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
    const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);

    const { addToCart } = useCart();
    const { collections, createCollection, addToCollection } = useRecommendation();

    const mainImage = product.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
    const thumbnails = product.product_images.slice(0, 4).map(img => img.image_url);
    while (thumbnails.length < 4) thumbnails.push(mainImage);

    const handleAddToCollectionPress = () => {
        setShowAddToCollectionModal(true);
    };

    const handleCreateCollection = async (name: string) => {
        await createCollection(name, product as any);
        setShowNewCollectionModal(false);
        setShowAddToCollectionModal(false);
        Alert.alert('Created!', `Collection "${name}" created with ${product.name}.`);
    };

    const handleAddToCollectionAction = async (collectionId: string) => {
        await addToCollection(collectionId, product.id);
        setShowAddToCollectionModal(false);
        Alert.alert('Added!', `${product.name} added to collection.`);
    };

    const handleLike = () => onLike();
    const handleSkip = () => onSkip();

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

    const handleBuyNow = () => onBuyNow(selectedSize);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const { translationX: tx, translationY, velocityX, velocityY } = event;
            const VERTICAL_THRESHOLD = SCREEN_HEIGHT * 0.2;
            const VERTICAL_SWIPE_THRESHOLD = 50;
            const isVerticalGesture = Math.abs(translationY) > Math.abs(tx);

            if (isVerticalGesture) {
                translateX.value = withTiming(0, { duration: 200 });
                if (translationY < -VERTICAL_SWIPE_THRESHOLD || velocityY < -500) {
                    runOnJS(expandPanel)();
                    return;
                } else if (translationY > VERTICAL_SWIPE_THRESHOLD || velocityY > 500) {
                    if (isExpanded) {
                        runOnJS(collapsePanel)();
                    } else if (translationY > VERTICAL_THRESHOLD || velocityY > 600) {
                        runOnJS(setShowSizeModal)(true);
                    }
                    return;
                }
            }

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
                translateX.value = withTiming(0, { duration: 200 });
            }
        });

    const panelGesture = Gesture.Pan()
        .onEnd((event) => {
            const { translationY, velocityY } = event;
            if (translationY < -50 || velocityY < -500) {
                runOnJS(expandPanel)();
            } else if (translationY > 50 || velocityY > 500) {
                runOnJS(collapsePanel)();
            }
        });

    const cardStyle = useAnimatedStyle(() => {
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

    const panelAnimatedStyle = useAnimatedStyle(() => ({
        height: panelHeight.value,
    }));

    const imageContainerStyle = useAnimatedStyle(() => {
        const imageHeight = interpolate(
            panelHeight.value,
            [COLLAPSED_PANEL_HEIGHT, EXPANDED_PANEL_HEIGHT],
            [CARD_HEIGHT - COLLAPSED_PANEL_HEIGHT, CARD_HEIGHT - EXPANDED_PANEL_HEIGHT],
            Extrapolation.CLAMP
        );
        return { height: imageHeight };
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
                    opacity: 1,
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
                        <View className="absolute inset-0 bg-black/5" />
                    </View>
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
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            height: CARD_HEIGHT,
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <ImageGallery
                            imageContainerStyle={imageContainerStyle}
                            mainImage={mainImage}
                            cardHeight={CARD_HEIGHT}
                            collapsedPanelHeight={COLLAPSED_PANEL_HEIGHT}
                            thumbnails={thumbnails}
                            onAddToCollection={handleAddToCollectionPress}
                            likeIndicatorStyle={likeIndicatorStyle}
                            skipIndicatorStyle={skipIndicatorStyle}
                        />

                        {/* Product Info Panel */}
                        <GestureDetector gesture={panelGesture}>
                            <View>
                                <ProductInfoPanel
                                    product={product}
                                    formattedPrice={formattedPrice}
                                    panelAnimatedStyle={panelAnimatedStyle}
                                    collapsedContentOpacity={collapsedContentOpacity}
                                    expandedContentOpacity={expandedContentOpacity}
                                    setContentHeight={setContentHeight}
                                    selectedSize={selectedSize}
                                    setSelectedSize={setSelectedSize}
                                    onAddToCart={confirmAddToCart}
                                    onBuyNow={handleBuyNow}
                                />
                            </View>
                        </GestureDetector>
                    </View>
                </Animated.View>
            </GestureDetector>

            <SizeSelectionModal
                visible={showSizeModal}
                onClose={() => setShowSizeModal(false)}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                onConfirm={confirmAddToCart}
            />

            <CollectionModals
                showAddToCollectionModal={showAddToCollectionModal}
                setShowAddToCollectionModal={setShowAddToCollectionModal}
                showNewCollectionModal={showNewCollectionModal}
                setShowNewCollectionModal={setShowNewCollectionModal}
                collections={collections}
                onAddToCollection={handleAddToCollectionAction}
                onCreateCollection={handleCreateCollection}
                product={product}
            />
        </>
    );
}