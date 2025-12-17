import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5 bg-white">
      <Text className="text-xl font-bold text-black mb-4">This is a modal</Text>
      <Link href="/" dismissTo asChild>
        <Text className="text-blue-500 text-lg mt-4 py-4">Go to home screen</Text>
      </Link>
    </View>
  );
}
