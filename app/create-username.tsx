import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeftIcon, ArrowRightIcon } from 'react-native-heroicons/outline';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Button dimensions
const BUTTON_HEIGHT = Math.round(86 * heightScale);
const BUTTON_BORDER_RADIUS = Math.round(24 * scale);

export default function CreateUsername() {
    const router = useRouter();
    const [username, setUsername] = useState('');

    const handleNext = () => {
        if (username.length > 0) {
            router.push('/gender-select');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    <View className="relative mb-8">
                        {/* Back button - absolutely positioned */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="absolute left-0 top-0 z-10"
                        >
                            <ChevronLeftIcon size={24} color="black" />
                        </TouchableOpacity>

                        {/* Progress Bar - Step 2/5 - Centered (Assuming this parallels phone login) */}
                        <View className="flex-row justify-center gap-1">
                            <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 w-8 bg-gray-200 rounded-full" />
                            <View className="h-1 w-8 bg-gray-200 rounded-full" />
                            <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        </View>
                    </View>

                    <View className="items-center mt-8 mb-12">
                        <Text className="text-black text-2xl font-bold text-center mb-4">
                            Create your username
                        </Text>
                        <Text className="text-gray-500 text-center px-4 leading-6 text-sm">
                            Choose a unique username for your profile. This is how others will see you on Swirl.
                        </Text>
                    </View>

                    <View className="mb-8">
                        <View className="bg-[#F7F8DB] rounded-full flex-row items-center px-4 py-4">
                            <Text className="text-gray-500 text-base mr-1">@</Text>
                            <TextInput
                                className="flex-1 text-black text-base font-medium"
                                placeholder="username"
                                placeholderTextColor="#999"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View className="flex-1" />

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            backgroundColor: '#E4AD82',
                            height: BUTTON_HEIGHT,
                            borderRadius: BUTTON_BORDER_RADIUS,
                            width: SCREEN_WIDTH,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginBottom: 16,
                            marginHorizontal: -24,
                            opacity: username.length > 0 ? 1 : 0.7
                        }}
                        disabled={username.length === 0}
                    >
                        <Text className="text-black text-center font-semibold text-lg">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
