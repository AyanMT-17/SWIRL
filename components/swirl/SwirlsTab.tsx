import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { XMarkIcon, ShoppingCartIcon, StarIcon } from 'react-native-heroicons/outline';

interface SwirlsTabProps {
    likedProducts: any[];
    handleRemoveFromSwirl: (id: string) => void;
    handleAddToCollection: (product: any) => void;
    addToCart: (product: any, size: string) => void;
    cardWidth: number;
}

export default function SwirlsTab({
    likedProducts,
    handleRemoveFromSwirl,
    handleAddToCollection,
    addToCart,
    cardWidth
}: SwirlsTabProps) {
    const getOriginalPrice = (price: number) => Math.round(price * 1.5);

    if (likedProducts.length === 0) {
        return (
            <View className="items-center justify-center py-20 px-4">
                <Text className="text-6xl mb-4">💫</Text>
                <Text className="text-xl font-bold text-gray-900 mb-2">No SWIRLs yet!</Text>
                <Text className="text-gray-500 text-center">
                    Swipe right on products you love{"\n"}to add them here.
                </Text>
            </View>
        );
    }

    return (
        <View className="px-4 pt-4">
            <FlatList
                data={likedProducts}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 16 }}
                renderItem={({ item }) => (
                    <View
                        className="bg-white rounded-3xl overflow-hidden"
                        style={{ width: cardWidth }}
                    >
                        <View className="relative">
                            <Image
                                source={{ uri: item.product_images[0]?.image_url }}
                                style={{ width: '100%', height: cardWidth * 1.1 }}
                                resizeMode="cover"
                            />

                            {/* X Icon to Remove from Swirl */}
                            <TouchableOpacity
                                onPress={() => handleRemoveFromSwirl(item.id)}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 3,
                                }}
                            >
                                <XMarkIcon size={16} color="#666" strokeWidth={2.5} />
                            </TouchableOpacity>

                            {/* Rating Badge */}
                            <View className="absolute bottom-2 left-2 flex-row items-center bg-white/90 px-2 py-1 rounded-full">
                                <Text className="text-xs font-semibold text-gray-900 mr-1">4.5</Text>
                                <StarIcon size={10} color="#000" />
                            </View>
                        </View>

                        {/* Product Info */}
                        <View className="p-3">
                            <Text className="text-xs text-gray-500 mb-0.5">{item.brand}</Text>
                            <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={1}>
                                {item.name}
                            </Text>

                            {/* Price Row */}
                            <View className="flex-row items-center gap-2 mb-3">
                                <Text className="text-sm font-bold text-gray-900">
                                    ₹ {item.price.toLocaleString('en-IN')}
                                </Text>
                                <Text className="text-xs text-gray-400 line-through">
                                    ₹{getOriginalPrice(item.price).toLocaleString('en-IN')}
                                </Text>
                                <View className="bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                                    <Text className="text-[10px] font-semibold text-red-600">50%off</Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => handleAddToCollection(item)}
                                    className="flex-1 bg-white border border-gray-300 py-2.5 rounded-xl items-center"
                                >
                                    <Text className="text-[11px] font-semibold text-gray-900">Add to Collection</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-[#E8B298] w-12 py-2.5 rounded-xl items-center justify-center"
                                    onPress={() => addToCart(item, 'M')}
                                >
                                    <ShoppingCartIcon size={18} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
