import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
// import { supabase } from '@/lib/supabase'; // Removed
import { ArrowLeft } from 'lucide-react-native';

export default function CreateUsername() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/gender-select');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <View className="flex-1 pt-12 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>

        <View className="mb-4 items-center">
          {/* Placeholder for user avatar bubble if needed, per design maybe just text */}
          <View className="w-20 h-20 bg-gray-800 rounded-full mb-4 overflow-hidden">
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              className="w-full h-full"
            />
          </View>
        </View>

        <Text className="text-white text-3xl font-bold text-center mb-2">
          Create Username
        </Text>
        <Text className="text-gray-400 text-center mb-12">
          This will be your unique identity on Swirl
        </Text>

        <View>
          <TextInput
            className="bg-white text-black px-6 py-4 rounded-full text-lg font-medium text-center"
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="flex-row gap-2 mt-4 justify-center">
          <View className="border border-white/20 rounded-full px-4 py-2">
            <Text className="text-white text-xs">Available</Text>
          </View>
          <View className="border border-white/20 rounded-full px-4 py-2">
            <Text className="text-white text-xs">Unique</Text>
          </View>
        </View>


        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading}
          className="bg-[#eecfb4] py-4 rounded-full mt-auto mb-10"
        >
          <Text className="text-black text-center font-bold text-lg">
            {loading ? 'Creating...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
