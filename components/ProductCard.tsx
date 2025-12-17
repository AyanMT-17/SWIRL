import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, X, Share2, Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    product_images: { image_url: string }[];
}

interface ProductCardProps {
    product: Product;
    onLike: () => void;
    onDislike: () => void;
    onShare: () => void;
}

export default function ProductCard({ product, onLike, onDislike, onShare }: ProductCardProps) {
    const mainImage = product.product_images[0]?.image_url || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800';
    // Mock thumbnails simply using the same image if multiples aren't available, or sliced if they are
    const thumbnails = product.product_images.slice(0, 3).map(img => img.image_url);
    // Fill with main image if not enough mock images
    while (thumbnails.length < 3) thumbnails.push(mainImage);

    return (
        <View className="flex-1 rounded-[40px] overflow-hidden bg-white mx-2 relative mb-24 box-shadow-xl">
            {/* Margin Bottom to account for floating tab bar overlap if needed, or we handle it in container */}

            {/* Main Image */}
            <Image
                source={{ uri: mainImage }}
                className="w-full h-full"
                resizeMode="cover"
            />

            {/* Thumbnails on Right */}
            <View className="absolute right-4 top-20 gap-3">
                {thumbnails.map((uri, index) => (
                    <View key={index} className="w-12 h-16 rounded-lg overflow-hidden border border-white/20">
                        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                    </View>
                ))}
            </View>

            {/* Product Info Overlay */}
            <View className="absolute top-1/2 left-4 right-16">
                <Text className="text-white text-3xl font-bold mb-1 shadow-black/50 shadow-lg">
                    {product.brand}
                </Text>
                <Text className="text-gray-200 text-lg shadow-black/50 shadow-lg" numberOfLines={2}>
                    {product.name}
                </Text>
            </View>


            {/* Bottom Action Bar */}
            <View className="absolute bottom-8 left-0 right-0 items-center justify-center pointer-events-none">
                {/* We use pointer-events-auto on buttons to allow clicking through the container if it overlaps */}
                <View className="flex-row items-center gap-6 pointer-events-auto bg-white/10 p-2 rounded-full backdrop-blur-md">
                    <TouchableOpacity
                        onPress={onDislike}
                        className="w-16 h-16 bg-white rounded-3xl items-center justify-center shadow-lg"
                    >
                        <X size={32} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onShare}
                        className="w-12 h-12 bg-transparent items-center justify-center"
                    >
                        <Share2 size={28} color="black" />
                        {/* The design shows an upload/share icon, closest is Share2 or Upload */}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onLike}
                        className="w-16 h-16 bg-white rounded-3xl items-center justify-center shadow-lg"
                    >
                        <Heart size={32} color="#eecfb4" fill="#eecfb4" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
