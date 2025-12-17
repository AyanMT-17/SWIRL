import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
// import { supabase } from '@/lib/supabase'; // Removed
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { Search, Heart } from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  product_images: { image_url: string }[];
}

const filters = ['Trending', 'Shops', 'Sweatshirts', 'Shirts', 'Bags'];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

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
          className="w-full h-64 rounded-lg bg-gray-100"
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
      </View>
      <View className="mt-2">
        <Text className="text-black font-bold">{item.brand}</Text>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-black font-bold mt-1">₦{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-4">
        <Text className="text-black text-2xl font-bold mb-4">Lumière</Text>

        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mb-4">
          <Search size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-black"
            placeholder="Search your needs"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`mr-3 px-6 py-2 rounded-full ${activeFilter === filter ? 'bg-[#eecfb4]' : 'bg-gray-100 border border-gray-200'
                }`}
            >
              <Text
                className={`font-medium ${activeFilter === filter ? 'text-black' : 'text-gray-600'
                  }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
