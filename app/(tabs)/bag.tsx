import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/contexts/CartContext';

import { Trash2 } from 'lucide-react-native';

export default function Bag() {
  const { cartItems, removeFromCart, getCartTotal, isLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // If you want to restrict cart to logged-in users only:
  // if (!user) ... 

  const total = getCartTotal();

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
      <Image
        source={{
          uri:
            item.product.product_images[0]?.image_url ||
            'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
        }}
        className="w-24 h-24 rounded-lg"
      />
      <View className="flex-1 ml-4">
        <Text className="text-black font-bold text-lg">
          {item.product.brand}
        </Text>
        <Text className="text-gray-500" numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">Size: {item.size}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-black font-bold">
            ₦{item.product.price * item.quantity}
          </Text>
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Trash2 size={20} color="#e76f51" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 px-4 pb-4">
        <Text className="text-black text-2xl font-bold">My Bag</Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-400 text-lg text-center">
            Your bag is empty
          </Text>
          <Text className="text-gray-500 text-sm text-center mt-2">
            Add items to your bag to see them here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          />

          <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-black text-lg">Total</Text>
              <Text className="text-black text-2xl font-bold">₦{total}</Text>
            </View>
            <TouchableOpacity className="bg-[#eecfb4] py-4 rounded-full">
              <Text className="text-black text-center font-bold text-lg">
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
