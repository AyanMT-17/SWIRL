import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from 'react-native-heroicons/solid';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Button dimensions
const BUTTON_HEIGHT = Math.round(86 * heightScale);
const BUTTON_BORDER_RADIUS = Math.round(24 * scale);

const VIBES = [
    { id: '1', name: 'Casual', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', name: 'Y2K', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', name: 'Minimalist', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '4', name: 'Athleisure', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '5', name: 'Streetwear', image: 'https://images.pexels.com/photos/6064683/pexels-photo-6064683.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '6', name: 'Vintage', image: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function FeedSelect() {
    const router = useRouter();
    const { setLikes, completeOnboarding } = useUserPreferences();
    const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const toggleVibe = (id: string) => {
        setSelectedVibes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleContinue = async () => {
        if (selectedVibes.size >= 2) {
            setIsLoading(true);

            // Convert selected vibe IDs to vibe names for the likes array
            const selectedVibeNames = VIBES
                .filter(vibe => selectedVibes.has(vibe.id))
                .map(vibe => vibe.name.toLowerCase());

            // Save likes to context
            setLikes(selectedVibeNames);

            // Complete onboarding - save to local + backend
            const { error } = await completeOnboarding();

            setIsLoading(false);

            if (error) {
                Alert.alert('Error', error);
            } else {
                console.log('[FeedSelect] Onboarding complete, navigating');
                router.replace('/invite-unlock');
            }
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-4 pt-12">
                {/* Header with back button and centered progress bar */}
                <View className="relative mb-8">
                    {/* Back button - absolutely positioned */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 top-0 z-10"
                    >
                        <ChevronLeftIcon size={24} color="black" />
                    </TouchableOpacity>

                    {/* Progress Bar - Step 5/5 - Centered */}
                    <View className="flex-row justify-center gap-1">
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                    </View>
                </View>

                {/* Title and Subtitle - positioned based on specs */}
                <View
                    style={{
                        marginTop: Math.round(142 * heightScale) - Math.round(80 * heightScale), // Adjust for header
                        alignItems: 'center',
                    }}
                >
                    <Text
                        className="text-black font-bold text-center"
                        style={{
                            width: Math.round(218 * widthScale),
                            height: Math.round(28 * heightScale),
                            fontSize: Math.round(20 * scale),
                        }}
                    >
                        Let's curate your feed.
                    </Text>
                    <Text className="text-gray-400 text-center text-sm mt-2 mb-6">
                        Pick 2 vibes to create your feed.
                    </Text>
                </View>

                {/* Vibes Grid */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: BUTTON_HEIGHT + 40 }}
                >
                    <View className="flex-row flex-wrap justify-between">
                        {VIBES.map((vibe) => (
                            <TouchableOpacity
                                key={vibe.id}
                                onPress={() => toggleVibe(vibe.id)}
                                style={{
                                    width: (SCREEN_WIDTH - 48) / 2,
                                    aspectRatio: 3 / 4,
                                    marginBottom: 12,
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                }}
                            >
                                <Image
                                    source={{ uri: vibe.image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                {/* Vibe name label at bottom */}
                                <View className="absolute bottom-0 left-0 right-0 p-3">
                                    <Text className="text-white font-semibold text-base" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                                        {vibe.name}
                                    </Text>
                                </View>
                                {/* Selection overlay */}
                                {selectedVibes.has(vibe.id) && (
                                    <View className="absolute inset-0 bg-black/30 items-center justify-center border-4 border-[#ccfd51]" style={{ borderRadius: 16 }}>
                                        <CheckCircleSolidIcon size={40} color="#ccfd51" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Next Button - Absolutely positioned at bottom */}
            <TouchableOpacity
                onPress={handleContinue}
                style={{
                    position: 'absolute',
                    top: Math.round(732 * heightScale),
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
