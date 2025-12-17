import { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import ProductCard from '@/components/ProductCard';

interface Product {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    brand: string;
    has_free_delivery: boolean;
    delivery_date: string | null;
    discount_percentage: number | null;
    product_images: { image_url: string }[];
}

export default function Swirl() {
    const [products, setProducts] = useState<Product[]>([]);
    // In a real app, this would use a swiper index
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setProducts(MOCK_PRODUCTS);
    };

    const currentProduct = products[currentIndex];

    const handleLike = () => {
        // Logic to add to favorites and show next card
        nextCard();
    };

    const handleDislike = () => {
        // Logic to skip and show next card
        nextCard();
    };

    const handleShare = () => {
        // Share logic
    };

    const nextCard = () => {
        setCurrentIndex(prev => (prev + 1) % products.length);
    };

    if (!currentProduct) {
        return <View className="flex-1 bg-black" />;
    }

    return (
        <View className="flex-1 bg-white pt-12">
            {/* We just show one card for the "stack" effect for now */}
            <ProductCard
                product={currentProduct}
                onLike={handleLike}
                onDislike={handleDislike}
                onShare={handleShare}
            />
        </View>
    );
}
