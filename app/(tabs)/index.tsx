import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/constants/mockData';
import { Search, Heart, ShoppingBag, ChevronDown } from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  slug: string;
}

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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    setCategories(MOCK_CATEGORIES);
  };

  const loadProducts = async () => {
    setProducts(MOCK_PRODUCTS);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="w-[48%] mb-4"
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View className="relative">
        <Image
          source={{
            uri:
              item.product_images[0]?.image_url ||
              'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
          }}
          className="w-full h-64 rounded-lg bg-gray-800"
        />
        <TouchableOpacity
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full"
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart
            size={20}
            color={favorites.has(item.id) ? '#e76f51' : '#000'}
            fill={favorites.has(item.id) ? '#e76f51' : 'transparent'}
          />
        </TouchableOpacity>
        {item.discount_percentage && (
          <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
            <Text className="text-white text-xs font-bold">
              -{item.discount_percentage}%
            </Text>
          </View>
        )}
      </View>
      <View className="mt-2">
        <Text className="text-white font-bold text-lg">{item.brand}</Text>
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-white font-bold text-lg">₦{item.price}</Text>
          {item.original_price && (
            <Text className="text-gray-500 text-sm line-through ml-2">
              ₦{item.original_price}
            </Text>
          )}
        </View>
        {item.has_free_delivery && (
          <Text className="text-green-500 text-xs mt-1">Free delivery</Text>
        )}
        {item.delivery_date && (
          <Text className="text-gray-400 text-xs">
            GET IT {item.delivery_date}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <ScrollView>
        <View className="px-4 pt-12 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-white text-lg font-bold mr-1">MEN</Text>
              <ChevronDown size={20} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">SWIRL</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity>
                <Search size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Heart size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="mr-3"
                onPress={() => router.push(`/categories?slug=${category.slug}`)}
              >
                <View className="w-20 items-center">
                  {category.image_url ? (
                    <Image
                      source={{ uri: category.image_url }}
                      className="w-16 h-16 rounded-full bg-gray-800"
                    />
                  ) : (
                    <View className="w-16 h-16 rounded-full bg-gray-800" />
                  )}
                  <Text className="text-white text-xs mt-2 text-center">
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 mb-4">
          <View className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=800',
              }}
              className="w-full h-full"
            />
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
              <Text className="text-white text-3xl font-bold mb-4">
                Holiday Season{'\n'}Essentials
              </Text>
              <TouchableOpacity className="bg-white py-3 px-8 rounded-full self-start">
                <Text className="text-black font-bold">Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-4 pb-20">
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}
