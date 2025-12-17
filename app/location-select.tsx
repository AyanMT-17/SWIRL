import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react-native';

export default function LocationSelect() {
    const router = useRouter();
    const [location, setLocation] = useState('India');

    const handleNext = () => {
        router.push('/phone-login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    <View className="flex-row items-center mb-8">
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={24} color="black" />
                        </TouchableOpacity>

                        {/* Segmented Progress Bar - Step 1/10 */}
                        <View className="flex-1 flex-row mx-4 gap-1">
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        </View>
                    </View>

                    <Text className="text-black text-3xl font-bold text-center mb-4">
                        Where do you live?
                    </Text>
                    <Text className="text-gray-500 text-center mb-12 px-4 leading-6">
                        This helps us find clothing that is perfectly altered to your taste. Don't worry we won't show it on your profile
                    </Text>

                    <View className="bg-white border border-gray-200 rounded-2xl flex-row items-center px-5 py-4 mb-4 shadow-sm">
                        {/* Flag placeholder */}
                        <Text className="text-2xl mr-3">🇮🇳</Text>
                        <TextInput
                            className="flex-1 text-black text-lg font-bold"
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Select Country"
                            placeholderTextColor="#999"
                        />
                        <ChevronRight size={20} color="black" />
                    </View>

                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-[#eecfb4] py-4 rounded-full mt-auto mb-4"
                    >
                        <Text className="text-black text-center font-bold text-lg">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
