import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

export default function ReferralCode() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '']);
    const displayCode = code.join('');

    // Mock input behavior for bubbles
    const handleTextChange = (text: string) => {
        const newCode = text.split('').slice(0, 4);
        while (newCode.length < 4) newCode.push('');
        setCode(newCode);
    };


    const handleNext = () => {
        router.push('/friends-invite');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    <View className="flex-row items-center mb-8 justify-between">
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={24} color="black" />
                        </TouchableOpacity>

                        {/* Segmented Progress Bar - Step 5/10 */}
                        <View className="flex-1 flex-row mx-4 gap-1">
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <Text className="text-black font-bold">Skip</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="items-center mt-8 mb-8">
                        <Text className="text-black text-lg font-bold text-center mb-4">
                            Got a referral code?
                        </Text>
                        <Text className="text-gray-500 text-center px-12 text-xs">
                            you and your friend gets extra 25 credits on your first 5 orders
                        </Text>
                    </View>

                    <View className="flex-row justify-center space-x-4 mb-4 gap-4 relative">
                        {/* Invisible Input overlay */}
                        <TextInput
                            className="absolute inset-0 w-full h-full opacity-0 z-10"
                            onChangeText={handleTextChange}
                            maxLength={4}
                            autoCapitalize="characters"
                            keyboardType="default"
                        />

                        {[0, 1, 2, 3].map((i) => (
                            <View key={i} className={`w-16 h-16 rounded-full items-center justify-center ${code[i] ? 'bg-[#f9f9f9] border border-gray-300' : 'bg-gray-100'}`}>
                                <Text className={`text-2xl font-bold ${code[i] ? 'text-black' : 'text-gray-400'}`}>{code[i]}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Friend Invite (Mock) */}
                    <View className="mt-8">
                        <Text className="text-black font-bold mb-4 text-center text-lg">Friends on SWIRL.</Text>
                        <Text className="text-gray-500 text-center text-xs mb-6 px-10">shop together with your friends and earn credit and extra offers on every order</Text>

                        <View className="flex-row justify-between items-center bg-transparent py-4 border-b border-gray-200">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-[#f9f9f9] rounded-full items-center justify-center border border-gray-100">
                                    <Text className="font-bold text-black">S</Text>
                                </View>
                                <View>
                                    <Text className="text-black font-bold">Shreyas Singh</Text>
                                    <Text className="text-gray-500 text-xs">780056XX2X</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-[#f9f9f9] border border-gray-100 px-4 py-1 rounded-full">
                                <Text className="text-black text-xs font-bold">Invite</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-[#eecfb4] py-4 rounded-full mt-auto"
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
