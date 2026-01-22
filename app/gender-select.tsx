import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Button dimensions
const BUTTON_HEIGHT = Math.round(86 * heightScale);
const BUTTON_BORDER_RADIUS = Math.round(24 * scale);

export default function GenderSelect() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);

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
                <View style={{ marginTop: Math.round(80 * heightScale) }}>
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
                    style={{ marginTop: Math.round(40 * heightScale), paddingHorizontal: Math.round(10 * widthScale) }}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedGender('men')}
                        className={`flex-1 py-4 rounded-full items-center justify-center ${selectedGender === 'men' ? 'bg-[#F7F8DB]' : 'bg-[#F5F5F5]'
                            }`}
                    >
                        <Text className="font-bold tracking-widest text-sm text-black">MALE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedGender('women')}
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
                    top: Math.round(732 * heightScale),
                    left: 0,
                    backgroundColor: '#E4AD82',
                    height: Math.round(86 * heightScale),
                    borderRadius: Math.round(24 * scale),
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
