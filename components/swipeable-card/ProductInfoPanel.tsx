import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import { HeartIcon as HeartIconOutline, StarIcon as StarIconOutline } from 'react-native-heroicons/outline';
import { StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { Product } from '@/contexts/LikesContext';

const AVATAR_SIZE = 32;
const ICON_SIZE_SM = 12;
const ICON_SIZE_MD = 14;
const ICON_SIZE_XL = 22;
const SIZE_BUTTON_SIZE = 40;

interface ProductInfoPanelProps {
    product: Product;
    formattedPrice: string;
    panelAnimatedStyle: any;
    collapsedContentOpacity: any;
    expandedContentOpacity: any;
    setContentHeight: (height: number) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function ProductInfoPanel({
    product,
    formattedPrice,
    panelAnimatedStyle,
    collapsedContentOpacity,
    expandedContentOpacity,
    setContentHeight,
    selectedSize,
    setSelectedSize,
    onAddToCart,
    onBuyNow,
}: ProductInfoPanelProps) {
    return (
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
                    onContentSizeChange={(_, height) => setContentHeight(height)}
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
                            onPress={onAddToCart}
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
                            onPress={onBuyNow}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }} numberOfLines={1}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </Animated.View>
    );
}
