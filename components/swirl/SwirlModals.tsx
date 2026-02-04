import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { Ionicons } from '@expo/vector-icons';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';
import { Collection } from '@/types/app';

interface SwirlModalsProps {
    showAddToCollection: boolean;
    setShowAddToCollection: (show: boolean) => void;
    showNewCollection: boolean;
    setShowNewCollection: (show: boolean) => void;
    showSelectProduct: boolean;
    setShowSelectProduct: (show: boolean) => void;
    collections: Collection[];
    selectedProductForCollection: any;
    likedProducts: any[];
    collectionName: string;
    setCollectionName: (name: string) => void;
    handleCreateCollection: () => void;
    addToCollection: (collectionId: string, productId: string) => Promise<void>;
    handleSelectProductForNewCollection: (product: any) => void;
    collectionCardWidth: number;
    router: any;
}

export default function SwirlModals({
    showAddToCollection,
    setShowAddToCollection,
    showNewCollection,
    setShowNewCollection,
    showSelectProduct,
    setShowSelectProduct,
    collections,
    selectedProductForCollection,
    likedProducts,
    collectionName,
    setCollectionName,
    handleCreateCollection,
    addToCollection,
    handleSelectProductForNewCollection,
    collectionCardWidth,
    router
}: SwirlModalsProps) {
    return (
        <>
            {/* Add to Collection Modal */}
            <Modal
                visible={showAddToCollection}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddToCollection(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '60%' }}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity
                                onPress={() => setShowAddToCollection(false)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <XMarkIcon size={22} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-base font-bold text-gray-900">Add to Collection</Text>
                            <TouchableOpacity
                                onPress={() => setShowNewCollection(true)}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <Ionicons name="add-outline" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Collections Grid */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap gap-3">
                                {collections.map((collection) => (
                                    <TouchableOpacity
                                        key={collection.id}
                                        className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                                        style={{ width: collectionCardWidth, height: collectionCardWidth * 1.2 }}
                                        onPress={async () => {
                                            if (selectedProductForCollection) {
                                                await addToCollection(collection.id, selectedProductForCollection.id);
                                            }
                                            setShowAddToCollection(false);
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
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* New Collection Modal */}
            <Modal
                visible={showNewCollection}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowNewCollection(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '70%' }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Header */}
                                <View className="flex-row items-center justify-between mb-6">
                                    <TouchableOpacity
                                        onPress={() => setShowNewCollection(false)}
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
                                    <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 }}>
                                        {selectedProductForCollection?.product_images[0]?.image_url ? (
                                            <Image
                                                source={{ uri: selectedProductForCollection.product_images[0].image_url }}
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
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Select Product for New Collection Modal */}
            <Modal
                visible={showSelectProduct}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSelectProduct(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '70%' }}>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity
                                onPress={() => router.back()} // Or close modal, but assuming router.back here mimics behavior
                            >
                                <LeftArrowIcon size={40} />
                            </TouchableOpacity>
                            <Text className="text-base font-bold text-gray-900">Select a Product</Text>
                            <View className="w-8 h-8" />
                        </View>

                        {/* Liked Products Grid */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap gap-3">
                                {likedProducts.map((product) => (
                                    <TouchableOpacity
                                        key={product.id}
                                        className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                                        style={{ width: collectionCardWidth, height: collectionCardWidth * 1.2 }}
                                        onPress={() => handleSelectProductForNewCollection(product)}
                                    >
                                        <Image
                                            source={{ uri: product.product_images[0]?.image_url }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                        {/* Product Name Label */}
                                        <View className="absolute bottom-0 left-0 right-0 bg-[#D4CFC4]/90 py-2 px-2">
                                            <Text className="text-xs font-semibold text-gray-800 text-center" numberOfLines={1}>
                                                {product.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}
