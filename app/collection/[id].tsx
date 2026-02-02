import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useRecommendation } from '@/contexts/RecommendationContext';
import { useProductFeed } from '@/contexts/ProductFeedContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function CollectionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { collections } = useRecommendation();
    const { products, getLikedProducts } = useProductFeed();

    // Find the collection
    const collection = collections.find(c => c.id === id);

    // Get products in this collection
    const likedProducts = getLikedProducts();
    const collectionProducts = collection?.productIds
        .map(productId => {
            // First try to find in liked products
            const likedProduct = likedProducts.find(p => p.id === productId);
            if (likedProduct) return likedProduct;
            // Then try all products
            return products.find(p => p.id === productId);
        })
        .filter(Boolean) || [];

    if (!collection) {
        return (
            <View style={{ flex: 1, backgroundColor: '#FDFFF2', paddingTop: insets.top }}>
                <View className="flex-row items-center p-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeftIcon size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold ml-4">Collection not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FDFFF2' }}>
            {/* Header */}
            <View
                style={{
                    paddingTop: insets.top + 10,
                    paddingBottom: 16,
                    paddingHorizontal: 16,
                    backgroundColor: '#FDFFF2',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                }}
            >
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ArrowLeftIcon size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold ml-2">{collection.name}</Text>
                    <Text className="text-gray-500 ml-2">({collectionProducts.length} items)</Text>
                </View>
            </View>

            {/* Products Grid */}
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {collectionProducts.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-gray-500 text-lg">No products in this collection</Text>
                        <Text className="text-gray-400 text-sm mt-2">Add products from your SWIRLs</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap" style={{ gap: 16 }}>
                        {collectionProducts.map((product: any, index) => (
                            <TouchableOpacity
                                key={product?.id || index}
                                style={{ width: CARD_WIDTH }}
                                onPress={() => router.push(`/product/${product?.id}`)}
                            >
                                <Image
                                    source={{ uri: product?.product_images?.[0]?.image_url }}
                                    style={{
                                        width: CARD_WIDTH,
                                        height: CARD_WIDTH * 1.3,
                                        borderRadius: 16,
                                    }}
                                    resizeMode="cover"
                                />
                                <View className="mt-2">
                                    <Text className="font-semibold text-sm" numberOfLines={1}>
                                        {product?.name}
                                    </Text>
                                    <Text className="text-gray-500 text-xs">{product?.brand}</Text>
                                    <Text className="font-bold text-sm mt-1">₹ {product?.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
