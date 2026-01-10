import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X, Plus } from 'lucide-react-native';
import { useLikes } from '@/contexts/LikesContext';
import { useCart } from '@/contexts/CartContext';

type Tab = 'swirls' | 'collection';

export default function Swirl() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<Tab>('swirls');
    const [showAddToCollection, setShowAddToCollection] = useState(false);
    const [showNewCollection, setShowNewCollection] = useState(false);
    const [collectionName, setCollectionName] = useState('');

    const { likedProducts, removeFromLikes } = useLikes();
    const { addToCart } = useCart();

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View
                className="bg-[#F5F3EE] border-b border-gray-200"
                style={{ paddingTop: insets.top }}
            >
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <ChevronLeft size={24} color="#000" strokeWidth={2} />
                    </TouchableOpacity>

                    {/* Tab Switcher */}
                    <View className="flex-row gap-6">
                        <TouchableOpacity onPress={() => setActiveTab('swirls')}>
                            <Text className={`text-sm font-semibold ${activeTab === 'swirls' ? 'text-gray-900' : 'text-gray-400'}`}>
                                My SWIRLs
                            </Text>
                            {activeTab === 'swirls' && (
                                <View className="h-0.5 bg-black mt-1 rounded-full" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveTab('collection')}>
                            <Text className={`text-sm font-semibold ${activeTab === 'collection' ? 'text-gray-900' : 'text-gray-400'}`}>
                                My Collection
                            </Text>
                            {activeTab === 'collection' && (
                                <View className="h-0.5 bg-black mt-1 rounded-full" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        {/* Placeholder for right icon */}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1">
                {activeTab === 'swirls' ? (
                    // My SWIRLs Tab
                    <View className="p-4">
                        {likedProducts.length === 0 ? (
                            <View className="items-center justify-center py-20">
                                <Text className="text-6xl mb-4">💫</Text>
                                <Text className="text-xl font-bold text-gray-900 mb-2">No SWIRLs yet!</Text>
                                <Text className="text-gray-500 text-center">
                                    Swipe right on products you love{"\n"}to add them here.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={likedProducts}
                                numColumns={2}
                                scrollEnabled={false}
                                keyExtractor={(item) => item.id}
                                columnWrapperStyle={{ gap: 12 }}
                                contentContainerStyle={{ gap: 12 }}
                                renderItem={({ item }) => (
                                    <View className="flex-1 bg-white rounded-3xl overflow-hidden border border-gray-200">
                                        {/* Remove Button */}
                                        <TouchableOpacity
                                            className="absolute top-3 right-3 z-10 w-6 h-6 bg-white rounded-full items-center justify-center"
                                            onPress={() => removeFromLikes(item.id)}
                                        >
                                            <X size={16} color="#000" />
                                        </TouchableOpacity>

                                        {/* Product Image */}
                                        <Image
                                            source={{ uri: item.product_images[0]?.image_url }}
                                            className="w-full h-48"
                                            resizeMode="cover"
                                        />

                                        {/* Product Info */}
                                        <View className="p-3">
                                            <Text className="text-xs text-gray-500 mb-1">{item.brand}</Text>
                                            <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text className="text-sm font-bold text-gray-900 mb-3">
                                                ₹ {item.price.toLocaleString('en-IN')}
                                            </Text>

                                            {/* Action Buttons */}
                                            <View className="flex-row gap-2">
                                                <TouchableOpacity
                                                    onPress={() => setShowAddToCollection(true)}
                                                    className="flex-1 bg-[#F5F3EE] py-2 rounded-lg items-center"
                                                >
                                                    <Text className="text-xs font-semibold text-gray-900">Add to Collection</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    className="bg-[#E8B298] px-4 py-2 rounded-lg items-center justify-center"
                                                    onPress={() => addToCart(item, 'M')}
                                                >
                                                    <Text className="text-lg">🛒</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                ) : (
                    // My Collection Tab
                    <View className="p-4">
                        <View className="flex-row flex-wrap gap-3">
                            {likedProducts.slice(0, 6).map((item, index) => (
                                <View
                                    key={item.id}
                                    className={`rounded-2xl overflow-hidden ${index % 3 === 0 ? 'w-[48%]' : 'w-[30%]'}`}
                                    style={{ height: index % 3 === 0 ? 200 : 150 }}
                                >
                                    <Image
                                        source={{ uri: item.product_images[0]?.image_url }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full">
                                        <Text className="text-xs font-semibold text-gray-900">{item.brand}</Text>
                                    </View>
                                </View>
                            ))}

                            {/* Add New Collection Button */}
                            <TouchableOpacity
                                onPress={() => setShowNewCollection(true)}
                                className="w-[30%] h-[150px] rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center"
                            >
                                <Plus size={32} color="#999" strokeWidth={2} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Add to Collection Modal */}
            <Modal
                visible={showAddToCollection}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddToCollection(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 h-[70%]">
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity onPress={() => setShowAddToCollection(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-lg font-bold">Add to Collection</Text>
                            <TouchableOpacity onPress={() => setShowNewCollection(true)}>
                                <Plus size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View className="flex-row flex-wrap gap-3">
                                {likedProducts.slice(0, 6).map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="w-[30%] h-32 rounded-2xl overflow-hidden border border-gray-200"
                                    >
                                        <Image
                                            source={{ uri: item.product_images[0]?.image_url }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                        <View className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 rounded-full">
                                            <Text className="text-[10px] font-semibold">{item.brand}</Text>
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
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                        <View className="flex-row items-center justify-between mb-6">
                            <TouchableOpacity onPress={() => setShowNewCollection(false)}>
                                <X size={24} color="#000" />
                            </TouchableOpacity>
                            <Text className="text-lg font-bold">New Collection</Text>
                            <TouchableOpacity className="bg-[#E8B298] px-4 py-2 rounded-lg">
                                <Text className="text-sm font-bold text-gray-900">Create</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="items-center mb-6">
                            <View className="w-32 h-32 bg-gray-200 rounded-2xl items-center justify-center mb-4">
                                <Plus size={40} color="#999" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Collection Name</Text>
                            <TextInput
                                value={collectionName}
                                onChangeText={setCollectionName}
                                placeholder="Enter collection name"
                                className="bg-[#F5F3EE] px-4 py-3 rounded-xl text-gray-900"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
