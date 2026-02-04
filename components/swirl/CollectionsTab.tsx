import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Collection } from '@/types/app';

interface CollectionsTabProps {
    collections: Collection[];
    onAddCollectionPress: () => void;
    collectionCardWidth: number;
}

export default function CollectionsTab({
    collections,
    onAddCollectionPress,
    collectionCardWidth
}: CollectionsTabProps) {
    const router = useRouter();

    const handleCollectionPress = (collectionId: string) => {
        router.push(`/collection/${collectionId}` as any);
    };

    return (
        <View className="p-4">
            <View className="flex-row flex-wrap gap-3">
                {collections.map((collection) => (
                    <TouchableOpacity
                        key={collection.id}
                        className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                        style={{ width: collectionCardWidth, height: collectionCardWidth * 1.2 }}
                        onPress={() => handleCollectionPress(collection.id)}
                    >
                        <Image
                            source={{ uri: collection.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {/* Item Count Badge */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 12,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                                {collection.productIds.length}
                            </Text>
                        </View>
                        {/* Collection Name Label */}
                        <View className="absolute bottom-0 left-0 right-0 bg-[#D4CFC4]/90 py-2 px-2">
                            <Text className="text-xs font-semibold text-gray-800 text-center" numberOfLines={1}>
                                {collection.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Add New Collection Button */}
                <TouchableOpacity
                    onPress={onAddCollectionPress}
                    className="rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center bg-white"
                    style={{ width: collectionCardWidth, height: collectionCardWidth * 1.2 }}
                >
                    <Ionicons name="add-outline" size={32} color="#999" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

