import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Collection } from '@/contexts/RecommendationContext';

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
    return (
        <View className="p-4">
            <View className="flex-row flex-wrap gap-3">
                {collections.map((collection) => (
                    <TouchableOpacity
                        key={collection.id}
                        className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                        style={{ width: collectionCardWidth, height: collectionCardWidth * 1.2 }}
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
