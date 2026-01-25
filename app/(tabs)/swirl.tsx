
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, TextInput, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XMarkIcon, ShoppingCartIcon, StarIcon } from 'react-native-heroicons/outline';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { useRecommendation } from '@/contexts/RecommendationContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'expo-router'; // Added useRouter import

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding
const COLLECTION_CARD_WIDTH = (SCREEN_WIDTH - 64) / 3; // 3 columns

// Fixed dimensions
const HEADER_BORDER_RADIUS = 24;
const FEED_BORDER_RADIUS = 24;

type Tab = 'swirls' | 'collection';

export default function Swirl() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<Tab>('swirls');
    const [showAddToCollection, setShowAddToCollection] = useState(false);
    const [showNewCollection, setShowNewCollection] = useState(false);
    const [showSelectProduct, setShowSelectProduct] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [selectedProductForCollection, setSelectedProductForCollection] = useState<any>(null);

    const { likedProductIds, collections, createCollection, addToCollection, removeFromSwirl } = useRecommendation();
    const { addToCart } = useCart();
    const router = useRouter(); // Initialized useRouter

    // Derive liked products from IDs
    const likedProducts = MOCK_PRODUCTS.filter(p => likedProductIds.includes(p.id));

    // Calculate discounted price (mock 50% off)
    const getOriginalPrice = (price: number) => Math.round(price * 1.5);

    const handleAddToCollection = (product: any) => {
        setSelectedProductForCollection(product);
        setShowAddToCollection(true);
    };

    const handleCreateCollection = async () => {
        if (collectionName.trim() && selectedProductForCollection) {
            await createCollection(collectionName, selectedProductForCollection);
            setCollectionName('');
            setShowNewCollection(false);
            setShowAddToCollection(false);
            setShowSelectProduct(false);
        }
    };

    const handleRemoveFromSwirl = async (productId: string) => {
        await removeFromSwirl(productId);
    };

    const handleSelectProductForNewCollection = (product: any) => {
        setSelectedProductForCollection(product);
        setShowSelectProduct(false);
        setShowNewCollection(true);
    };

    const displayCollections = collections.length > 0 ? collections : [];


    return (
        <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: 94 }}>
            {/* Floating Header - Matches home page style */}
            <View
                style={{
                    backgroundColor: '#FDFFF2',
                    zIndex: 50,
                    overflow: 'hidden',
                    borderRadius: HEADER_BORDER_RADIUS,
                    paddingTop: Math.max(insets.top, 44),
                    paddingBottom: 16,
                    paddingHorizontal: 16,
                }}
            >
                <View className="flex-row items-center">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <LeftArrowIcon size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Tab Switcher - Centered */}
                    <View className="flex-1 flex-row justify-center gap-10">
                        <TouchableOpacity onPress={() => setActiveTab('swirls')}>
                            <Text className={`text - base font - semibold ${activeTab === 'swirls' ? 'text-gray-900' : 'text-gray-400'} `}>
                                My SWIRL.s'
                            </Text>
                            {activeTab === 'swirls' && (
                                <View className="h-0.5 bg-[#ccfd51] mt-1 rounded-full w-24" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveTab('collection')}>
                            <Text className={`text - base font - semibold ${activeTab === 'collection' ? 'text-gray-900' : 'text-gray-400'} `}>
                                My Collection
                            </Text>
                            {activeTab === 'collection' && (
                                <View className="h-0.5 bg-[#ccfd51] mt-1 rounded-full w-24" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Empty spacer for balance */}
                    <View className="w-10 h-10" />
                </View>
            </View>

            {/* Feed Section - Separated with gap and rounded corners */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FDFFF2',
                    marginTop: 3,
                    borderRadius: FEED_BORDER_RADIUS,
                    marginBottom: 0,
                    overflow: 'hidden',
                }}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'swirls' ? (
                        // My SWIRLs Tab
                        <View className="px-4 pt-4">
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
                                    contentContainerStyle={{ gap: 16 }}
                                    renderItem={({ item }) => (
                                        <View
                                            className="bg-white rounded-3xl overflow-hidden"
                                            style={{ width: CARD_WIDTH }}
                                        >
                                            <View className="relative">
                                                <Image
                                                    source={{ uri: item.product_images[0]?.image_url }}
                                                    style={{ width: '100%', height: CARD_WIDTH * 1.1 }}
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
                            )}
                        </View>
                    ) : (
                        // My Collection Tab
                        <View className="p-4">
                            <View className="flex-row flex-wrap gap-3">
                                {collections.map((collection) => (
                                    <TouchableOpacity
                                        key={collection.id}
                                        className="rounded-2xl overflow-hidden bg-[#E8E4DB]"
                                        style={{ width: COLLECTION_CARD_WIDTH, height: COLLECTION_CARD_WIDTH * 1.2 }}
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
                                    onPress={() => {
                                        if (likedProducts.length === 0) {
                                            // No liked products, show alert
                                            return;
                                        }
                                        setShowSelectProduct(true);
                                    }}
                                    className="rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center bg-white"
                                    style={{ width: COLLECTION_CARD_WIDTH, height: COLLECTION_CARD_WIDTH * 1.2 }}
                                >
                                    <Ionicons name="add-outline" size={32} color="#999" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>

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
                                        style={{ width: COLLECTION_CARD_WIDTH, height: COLLECTION_CARD_WIDTH * 1.2 }}
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
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-[#F5F3EE] rounded-t-3xl p-5" style={{ height: '55%' }}>
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
                            <View className="bg-white rounded-2xl p-3 shadow-sm">
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
                                <TouchableOpacity className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm">
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
                                onPress={() => router.back()}
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
                                        style={{ width: COLLECTION_CARD_WIDTH, height: COLLECTION_CARD_WIDTH * 1.2 }}
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
        </View>
    );
}
