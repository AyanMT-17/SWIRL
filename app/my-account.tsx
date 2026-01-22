import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const { width } = Dimensions.get('window');

export default function MyAccount() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('user');
    const [age, setAge] = useState('19');
    const [email, setEmail] = useState('user@gmail.com');
    const [phone, setPhone] = useState('+91 1234567890');

    const handleSave = () => {
        // Save logic here (mock for now)
        router.back();
    };

    return (
        <View className="flex-1 bg-[#FDFCF7]">
            {/* Header */}
            <View style={{ paddingTop: insets.top }} className="px-4 pb-4 bg-[#FDFCF7] z-10">
                <View className="flex-row items-center justify-between py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center -ml-2"
                    >
                        <ChevronLeftIcon size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-normal text-black flex-1 text-center pr-8">
                        My account
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-4"
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Inputs */}
                    <View className="space-y-4">
                        {/* Name Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                            />
                        </View>

                        {/* Age Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Age</Text>
                            <TextInput
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                            />
                        </View>

                        {/* Email Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                            />
                        </View>

                        {/* Phone Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Phone Number</Text>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View
                className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-8 bg-[#FDFCF7]"
                style={{ paddingBottom: insets.bottom + 16 }}
            >
                <TouchableOpacity
                    onPress={handleSave}
                    className="w-full bg-[#E5B58D] rounded-full py-4 items-center justify-center shadow-sm"
                >
                    <Text className="text-lg font-normal text-black">Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
