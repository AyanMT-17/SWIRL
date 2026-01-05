import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  MessageCircle,
  Heart,
  Share2,
  Info,
  ChevronRight,
  UserPlus
} from 'lucide-react-native';

export default function Account() {
  const { user, signOut } = useAuth();

  // Extract first name from email or use default
  const userName = user?.email?.split('@')[0] || 'User';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const menuItems = [
    {
      icon: User,
      label: 'My account',
      subtitle: 'View and edit your profile details',
      onPress: () => { }
    },
    {
      icon: MessageCircle,
      label: 'Speak to the founder',
      subtitle: 'Report an issue or share your thoughts',
      onPress: () => { }
    },
    {
      icon: Heart,
      label: 'My vibe',
      subtitle: 'Define your vibe preference and size',
      onPress: () => { }
    },
    {
      icon: Share2,
      label: 'Connect your Pinterest board',
      subtitle: 'Coming soon!',
      onPress: () => { }
    },
    {
      icon: Info,
      label: 'Show app tutorial',
      subtitle: '',
      onPress: () => { }
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#f5f5f0]">
      {/* Header Section */}
      <View className="bg-white rounded-b-3xl pt-12 px-5 pb-6">
        <Text className="text-black text-3xl font-bold mb-4">
          Hey, {displayName}
        </Text>

        <TouchableOpacity className="flex-row items-center bg-[#f4a261] px-4 py-3 rounded-full self-start">
          <UserPlus size={18} color="#fff" />
          <Text className="text-white font-semibold ml-2">Invite friends</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View className="px-4 mt-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="flex-row items-center bg-white p-4 rounded-2xl mb-2"
          >
            <View className="w-10 h-10 items-center justify-center">
              <item.icon size={20} color="#000" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-black text-base font-semibold">
                {item.label}
              </Text>
              {item.subtitle ? (
                <Text className="text-gray-400 text-sm mt-0.5">
                  {item.subtitle}
                </Text>
              ) : null}
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
