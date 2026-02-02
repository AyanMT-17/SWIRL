import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/contexts/LikesContext';
import { Collection } from '@/contexts/RecommendationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLLECTION_CARD_WIDTH = (SCREEN_WIDTH - 64) / 3;

interface CollectionModalsProps {
    showAddToCollectionModal: boolean;
    setShowAddToCollectionModal: (show: boolean) => void;
    showNewCollectionModal: boolean;
    setShowNewCollectionModal: (show: boolean) => void;
    collections: Collection[];
    onAddToCollection: (collectionId: string) => Promise<void>;
    onCreateCollection: (name: string) => Promise<void>;
    product: Product;
}

export default function CollectionModals({
    showAddToCollectionModal,
    setShowAddToCollectionModal,
    showNewCollectionModal,
    setShowNewCollectionModal,
    collections,
    onAddToCollection,
    onCreateCollection,
    product,
}: CollectionModalsProps) {
    const [collectionName, setCollectionName] = useState('');

    const handleCreate = async () => {
        if (collectionName.trim()) {
            await onCreateCollection(collectionName);
            setCollectionName('');
        }
    };

    return (
        <>
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
                                            onPress={() => onAddToCollection(collection.id)}
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
                                onPress={handleCreate}
                            >
                                <Text className="text-sm font-bold text-gray-900">Create</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Collection Image Preview */}
                        <View className="items-center mb-6">
                            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 }}>
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
                                {/* Small edit icon */}
                                <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 }}>
                                    <Ionicons name="add-outline" size={14} color="#666" />
                                </TouchableOpacity>
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
