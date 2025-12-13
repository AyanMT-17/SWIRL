import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { User, Heart, ShoppingBag, Settings, LogOut } from 'lucide-react-native';

export default function Account() {
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: User, label: 'Profile', onPress: () => {} },
    { icon: Heart, label: 'Favorites', onPress: () => {} },
    { icon: ShoppingBag, label: 'Orders', onPress: () => {} },
    { icon: Settings, label: 'Settings', onPress: () => {} },
  ];

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="pt-12 px-4 pb-8">
        <Text className="text-white text-2xl font-bold mb-2">Account</Text>
        <Text className="text-gray-400">{user?.email}</Text>
      </View>

      <View className="px-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="flex-row items-center bg-gray-900 p-4 rounded-xl mb-3"
          >
            <item.icon size={24} color="#f4a261" />
            <Text className="text-white text-lg ml-4 flex-1">{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={signOut}
          className="flex-row items-center bg-red-500/20 p-4 rounded-xl mt-4"
        >
          <LogOut size={24} color="#e76f51" />
          <Text className="text-red-500 text-lg ml-4 flex-1">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
