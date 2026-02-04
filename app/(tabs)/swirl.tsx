import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductFeed } from '@/contexts/ProductFeedContext';

import { useCart } from '@/contexts/CartContext';
import { useCollections } from '@/contexts/CollectionsContext';
import { useRouter } from 'expo-router';
import SwirlHeader from '@/components/swirl/SwirlHeader';
import SwirlsTab from '@/components/swirl/SwirlsTab';
import CollectionsTab from '@/components/swirl/CollectionsTab';
import SwirlModals from '@/components/swirl/SwirlModals';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding
const COLLECTION_CARD_WIDTH = (SCREEN_WIDTH - 64) / 3; // 3 columns
const FEED_BORDER_RADIUS = 24;

type Tab = 'swirls' | 'collection';

export default function Swirl() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('swirls');
    const [showAddToCollection, setShowAddToCollection] = useState(false);
    const [showNewCollection, setShowNewCollection] = useState(false);
    const [showSelectProduct, setShowSelectProduct] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [selectedProductForCollection, setSelectedProductForCollection] = useState<any>(null);

    // Use ProductFeedContext for liked products (backend data)
    const { getLikedProducts, removeFromLiked } = useProductFeed();

    // Use CollectionsContext for user-specific local collections
    const { collections, createCollection, addToCollection } = useCollections();
    const { addToCart } = useCart();

    // Get liked products from the backend-synced context
    const likedProducts = getLikedProducts();

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
        await removeFromLiked(productId);
    };

    const handleSelectProductForNewCollection = (product: any) => {
        setSelectedProductForCollection(product);
        setShowSelectProduct(false);
        setShowNewCollection(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: 94 }}>
            <SwirlHeader
                insets={insets}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Feed Section */}
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
                        <SwirlsTab
                            likedProducts={likedProducts}
                            handleRemoveFromSwirl={handleRemoveFromSwirl}
                            handleAddToCollection={handleAddToCollection}
                            addToCart={addToCart}
                            cardWidth={CARD_WIDTH}
                        />
                    ) : (
                        <CollectionsTab
                            collections={collections}
                            onAddCollectionPress={() => {
                                if (likedProducts.length === 0) return;
                                setShowSelectProduct(true);
                            }}
                            collectionCardWidth={COLLECTION_CARD_WIDTH}
                        />
                    )}
                </ScrollView>
            </View>

            <SwirlModals
                showAddToCollection={showAddToCollection}
                setShowAddToCollection={setShowAddToCollection}
                showNewCollection={showNewCollection}
                setShowNewCollection={setShowNewCollection}
                showSelectProduct={showSelectProduct}
                setShowSelectProduct={setShowSelectProduct}
                collections={collections}
                selectedProductForCollection={selectedProductForCollection}
                likedProducts={likedProducts}
                collectionName={collectionName}
                setCollectionName={setCollectionName}
                handleCreateCollection={handleCreateCollection}
                addToCollection={addToCollection}
                handleSelectProductForNewCollection={handleSelectProductForNewCollection}
                collectionCardWidth={COLLECTION_CARD_WIDTH}
                router={router}
            />
        </View>
    );
}
