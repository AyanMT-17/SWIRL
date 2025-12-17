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
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/referral-code');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 pt-12 px-6">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>

          {/* Segmented Progress Bar - Step 4/10 */}
          <View className="flex-1 flex-row mx-4 gap-1">
            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
          </View>
        </View>

        <View className="mb-4 items-center">
          {/* Placeholder for user avatar bubble if needed, per design maybe just text */}
          <View className="w-20 h-20 bg-gray-100 rounded-full mb-4 overflow-hidden border border-gray-200">
            {/* Displaying placeholder image or keeping it basic */}
          </View>
        </View>

        <Text className="text-black text-3xl font-bold text-center mb-2">
          What should we call you?
        </Text>
        <Text className="text-gray-500 text-center mb-12">
          this helps your friends find you
        </Text>

        <View>
          <TextInput
            className="bg-transparent text-black px-6 py-4 rounded-full text-6xl font-medium text-center"
            placeholder="name"
            placeholderTextColor="#eecfb4"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="flex-row gap-2 mt-4 justify-center">
        </View>


        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading}
          className="bg-[#eecfb4] py-4 rounded-full mt-auto mb-10"
        >
          <Text className="text-black text-center font-bold text-lg">
            {loading ? 'Creating...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
