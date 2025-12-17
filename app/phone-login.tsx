import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Apple, ChevronLeft } from 'lucide-react-native';

export default function PhoneLogin() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleNext = () => {
        // Navigate to OTP verify
        router.push(`/otp-verify?phone=${encodeURIComponent(phoneNumber)}`);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    <View className="flex-row items-center mb-12">
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={24} color="black" />
                        </TouchableOpacity>

                        {/* Segmented Progress Bar - Step 2/10 */}
                        <View className="flex-1 flex-row mx-4 gap-1">
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
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

                    <View className="items-center mb-24 mt-4">
                        <Text className="text-black text-3xl font-bold tracking-widest">
                            SWIRL.
                        </Text>
                    </View>

                    <View className="bg-[#f9f9f9] border border-gray-200 rounded-2xl flex-row items-center px-4 py-4 mb-12">
                        <TouchableOpacity className="flex-row items-center mr-2 border-r border-gray-300 pr-3">
                            <Text className="text-black text-lg font-bold">91+</Text>
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 text-black text-lg font-medium ml-2"
                            placeholder="Enter Phone Number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <TouchableOpacity onPress={handleNext}>
                            <View className="bg-[#eecfb4] rounded-full p-2">
                                <ArrowRight size={16} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center mb-8">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="text-gray-400 mx-4">Or login with</Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    <View className="flex-row justify-between gap-4 mb-4">
                        <TouchableOpacity className="flex-1 bg-[#f9f9f9] border border-gray-200 py-3 rounded-xl flex-row items-center justify-center">
                            <Text className="text-xl mr-2">G</Text>
                            <Text className="text-black font-bold">Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-[#f9f9f9] border border-gray-200 py-3 rounded-xl flex-row items-center justify-center">
                            <Text className="text-xl mr-2"></Text>
                            <Text className="text-black font-bold">Apple</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className="mt-4 self-center">
                        <Text className="text-red-400 text-xs">Login as an Influencer</Text>
                    </TouchableOpacity>

                    <TextInput
                        className="bg-[#f9f9f9] border border-gray-200 text-black px-4 py-3 rounded-xl text-base font-medium mb-12 hidden"
                        placeholder="Enter Referral Code"
                        placeholderTextColor="#999"
                    />

                    <View className="mt-auto items-center flex-row relative mb-4 opacity-0">
                        {/* Hidden bottom section placeholder to keep layout stable if needed, or just remove */}
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
