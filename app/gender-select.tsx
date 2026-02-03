import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fixed button dimensions
const BUTTON_HEIGHT = 86;
const BUTTON_BORDER_RADIUS = 24;

export default function GenderSelect() {
    const router = useRouter();
    const { setGender, onboardingData } = useUserPreferences();
    const [selectedGender, setSelectedGender] = useState<string | null>(onboardingData.gender || null);

    const handleGenderSelect = async (gender: string) => {
        setSelectedGender(gender);
        // Map to backend format: 'men' -> 'Men', 'women' -> 'Women'
        const formattedGender = gender === 'men' ? 'Men' : 'Women';
        setGender(formattedGender);

        // Save to storage immediately for "Direct Access" resuming
        try {
            await AsyncStorage.setItem('swirl_temp_gender', formattedGender);
        } catch (e) {
            console.warn('Failed to save temp gender', e);
        }
    };

    const handleContinue = () => {
        if (selectedGender) {
            router.push('/feed-select');
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-12">
                <View className="relative mb-8">
                    {/* Back button - absolutely positioned */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 top-0 z-10"
                    >
                        <ChevronLeftIcon size={24} color="black" />
                    </TouchableOpacity>

                    {/* Progress Bar - Step 3/5 - Centered */}
                    <View className="flex-row justify-center gap-1">
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <View style={{ marginTop: 80 }}>
                    <Text className="text-black text-2xl font-bold text-center mb-4">
                        Select your Gender?
                    </Text>
                    <Text className="text-gray-400 text-center text-sm leading-5 px-4">
                        We'll show you brands and products{'\n'}that match your style and interests
                    </Text>
                </View>

                {/* Gender Buttons */}
                <View
                    className="flex-row gap-3"
                    style={{ marginTop: 40, paddingHorizontal: 10 }}
                >
                    <TouchableOpacity
                        onPress={() => handleGenderSelect('men')}
                        className={`flex-1 py-4 rounded-full items-center justify-center ${selectedGender === 'men' ? 'bg-[#F7F8DB]' : 'bg-[#F5F5F5]'
                            }`}
                    >
                        <Text className="font-bold tracking-widest text-sm text-black">MALE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleGenderSelect('women')}
                        className={`flex-1 py-4 rounded-full items-center justify-center ${selectedGender === 'women' ? 'bg-[#F7F8DB]' : 'bg-[#F5F5F5]'
                            }`}
                    >
                        <Text className="font-bold tracking-widest text-sm text-black">FEMALE</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {/* Next Button - Absolutely positioned at bottom */}
            <TouchableOpacity
                onPress={handleContinue}
                style={{
                    position: 'absolute',
                    bottom: 34,
                    left: 0,
                    backgroundColor: '#E4AD82',
                    height: BUTTON_HEIGHT,
                    borderRadius: BUTTON_BORDER_RADIUS,
                    width: SCREEN_WIDTH,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text className="text-black text-center font-semibold text-lg">
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    );
}
