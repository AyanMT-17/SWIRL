import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Apple } from 'lucide-react-native';



export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in all fields');
    //   return;
    // }

    setLoading(true);
    // Mock login for UI testing, allowing empty fields for quick flow test
    const { error } = isLogin
      ? await signIn(email || 'test@test.com', password || 'password')
      : await signUp(email || 'test@test.com', password || 'password');

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Navigate to next step instead of home directly for signup/login flow check
      router.replace('/create-username');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-[35vh] w-full relative">
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
        </View>

        <View className="flex-1 px-6 pt-8 pb-8">
          <Text className="text-white text-4xl font-bold mb-8">
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>

          <View className="space-y-4">
            <TextInput
              className="bg-[#f5f5f5] text-black px-4 py-4 rounded-xl text-lg font-medium"
              placeholder="Email or Phone number"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              className="bg-[#f5f5f5] text-black px-4 py-4 rounded-xl text-lg font-medium"
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View className="flex-row items-center justify-between mt-2">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${rememberMe ? 'bg-[#eecfb4] border-[#eecfb4]' : 'bg-transparent'}`}>
                  {rememberMe && <Check size={14} color="black" />}
                </View>
                <Text className="text-gray-400">Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-white font-bold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              className="bg-[#eecfb4] py-4 rounded-full mt-6"
            >
              <Text className="text-black text-center font-bold text-lg">
                {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-800" />
              <Text className="text-gray-500 mx-4">Or login with</Text>
              <View className="flex-1 h-[1px] bg-gray-800" />
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity className="flex-1 bg-white py-3 rounded-full flex-row items-center justify-center">
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  className="w-5 h-5 mr-2"
                />
                <Text className="font-bold text-black">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white py-3 rounded-full flex-row items-center justify-center">
                <Apple size={20} color="black" className="mr-2" />
                <Text className="font-bold text-black">Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              className="mt-8"
            >
              <Text className="text-gray-400 text-center">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text className="text-[#eecfb4] font-bold">
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
