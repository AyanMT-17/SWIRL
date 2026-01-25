import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { ShoppingCartIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecommendation } from '@/contexts/RecommendationContext';
import { useState, useCallback } from 'react';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';

const { width } = Dimensions.get('window');

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getProductById } = useRecommendation();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const product = getProductById(Number(id));

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size first');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Added to Cart', `${product?.name} (Size: ${selectedSize}) added to your cart`);
    }, 500);
  }, [product, selectedSize]);

  // If product not found (shouldn't happen in normal flow)
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Product not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 p-2 bg-black rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use product images if available, otherwise fallback is handled in lower layers or UI
  const images = product.product_images && product.product_images.length > 0
    ? product.product_images
    : [{ image_url: product.product_images[0]?.image_url || '', sort_order: 0 }];

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{ uri: product.product_images[0]?.image_url }}
            style={{ width: '100%', height: 550 }}
            resizeMode="cover"
          />

          {/* Header Actions */}
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-4">
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <LeftArrowIcon size={40} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/cart')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: 8,
                borderRadius: 9999,
              }}
            >
              <ShoppingCartIcon size={24} color="#000" />
            </TouchableOpacity>
          </SafeAreaView>

          <View className="flex-row absolute bottom-4 right-4 bg-black/50 px-3 py-2 rounded-full">
            {images.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === selectedImageIndex ? 'bg-white' : 'bg-gray-500'}`}
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
            onPress={handleAddToCart}
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
