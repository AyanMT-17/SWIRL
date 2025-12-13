import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// import { supabase } from '@/lib/supabase'; // Removed
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  product_images: { image_url: string; sort_order: number }[];
  product_sizes: { size: string; stock_quantity: number }[];
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToCart, isLoading: cartLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
    if (foundProduct) {
      // Enriched mock product with sizes and images sort order if needed
      const enrichedProduct: Product = {
        ...foundProduct,
        description: foundProduct.description || '',
        product_images: foundProduct.product_images.map((img, idx) => ({ ...img, sort_order: idx })),
        product_sizes: sizes.map(s => ({ size: s, stock_quantity: 10 }))
      };
      setProduct(enrichedProduct);
      if (enrichedProduct.product_sizes?.length > 0) {
        setSelectedSize(enrichedProduct.product_sizes[0].size);
      }
    }
  };

  const handleAddToBag = async () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }

    if (!product) return;

    // Convert local Product to CartContext Product (they are basically the same structurally but interface names differ in code)
    // Actually our CartContext Product interface is compatible with MOCK_PRODUCTS structure.

    setLoading(true);

    try {
      await addToCart(product, selectedSize);
      Alert.alert('Success', 'Added to bag!', [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'Go to Bag', onPress: () => router.push('/(tabs)/bag') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const images = product.product_images.sort((a, b) => a.sort_order - b.sort_order);

  return (
    <View className="flex-1 bg-black">
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/50 p-3 rounded-full"
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity className="bg-black/50 p-3 rounded-full">
          <ShoppingBag size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{
                  uri:
                    img.image_url ||
                    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
                }}
                style={{ width, height: width * 1.2 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View className="flex-row absolute bottom-4 right-4 bg-black/50 px-3 py-2 rounded-full">
            {images.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === selectedImageIndex ? 'bg-white' : 'bg-gray-500'
                  }`}
              />
            ))}
          </View>

          <View className="absolute right-4 top-[40%] space-y-2">
            {images.slice(0, 4).map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className={`border-2 rounded-lg overflow-hidden ${selectedImageIndex === index
                  ? 'border-[#eecfb4]'
                  : 'border-transparent'
                  }`}
              >
                <Image
                  source={{ uri: img.image_url }}
                  className="w-16 h-20"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 py-6 bg-gray-900 rounded-t-3xl -mt-6 h-full pb-20">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1 text-white">{product.name}</Text>
              <Text className="text-gray-400">{product.brand}</Text>
            </View>
            <Text className="text-2xl font-bold text-[#eecfb4]">₦{product.price}</Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-white">Select size</Text>
            <View className="flex-row flex-wrap gap-2">
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`px-6 py-3 rounded-full border-2 ${selectedSize === size
                    ? 'bg-[#eecfb4] border-[#eecfb4]'
                    : 'bg-transparent border-gray-600'
                    }`}
                >
                  <Text
                    className={`font-semibold ${selectedSize === size ? 'text-black' : 'text-gray-300'
                      }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 leading-6">
              {product.description ||
                'Celebrate the great simplicity of the Swedish Trac warm brushed fleece hoodie is made with some extra room through the shoulders, chest and body for easy comfort and laid- back, nostalgic style'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToBag}
            disabled={loading}
            className="bg-[#eecfb4] py-4 rounded-full"
          >
            <Text className="text-black text-center font-bold text-lg">
              {loading ? 'Adding...' : 'Add to cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
