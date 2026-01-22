import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Linking, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Button dimensions
const BUTTON_HEIGHT = Math.round(86 * heightScale);
const BUTTON_BORDER_RADIUS = Math.round(24 * scale);

export default function InviteUnlock() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState('');

    const handleUnlock = () => {
        // In a real app, verify code here.
        router.replace('/(tabs)');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black"
        >

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">

                    {/* SWIRL Logo */}
                    <View className="items-center" style={{ marginTop: Math.round(80 * heightScale) }}>
                        <Text
                            className="text-white tracking-widest"
                            style={{
                                fontSize: Math.round(42 * scale),
                                fontWeight: '800',
                                fontFamily: 'DMSans_700Bold',
                                fontStyle: 'italic',
                            }}
                        >
                            SWIRL.
                        </Text>
                    </View>

                    {/* Description Text */}
                    <View className="items-center" style={{ marginTop: Math.round(100 * heightScale) }}>
                        <Text className="text-gray-400 text-center text-xs font-medium leading-5 px-4">
                            Be among the first to experience next-gen AI fashion
                        </Text>
                        <Text className="text-gray-400 text-center text-xs font-medium leading-5 px-4">
                            Enter your invite code to unlock the experience
                        </Text>
                    </View>

                    {/* Form Section - positioned at top 432px */}
                    <View
                        style={{
                            position: 'absolute',
                            top: Math.round(350 * heightScale),
                            left: 0,
                            right: 0,
                            paddingHorizontal: 0,
                        }}
                    >
                        {/* Invite Code Input */}
                        <View
                            className="bg-black"
                            style={{
                                width: SCREEN_WIDTH,
                                height: Math.round(86 * heightScale),
                                borderColor: '#E4AD82',
                                borderWidth: 1,
                                borderRadius: Math.round(24 * scale),
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <TextInput
                                className="text-white text-center text-base"
                                value={inviteCode}
                                onChangeText={setInviteCode}
                                placeholder="Enter Invite Code"
                                placeholderTextColor="#999"
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* Unlock Access Button */}
                        <TouchableOpacity
                            onPress={handleUnlock}
                            style={{
                                backgroundColor: '#E4AD82',
                                width: SCREEN_WIDTH,
                                height: Math.round(86 * heightScale),
                                borderRadius: Math.round(24 * scale),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text className="text-black text-center font-semibold text-lg">
                                Unlock Access
                            </Text>
                        </TouchableOpacity>

                        {/* Don't have a code? */}
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)')}
                            style={{ marginTop: Math.round(24 * heightScale) }}
                        >
                            <Text className="text-gray-400 text-center text-sm">
                                Don't have a code?
                            </Text>
                        </TouchableOpacity>

                        {/* Footer Text */}
                        <View style={{ marginTop: Math.round(50 * heightScale) }}>
                            <Text className="text-gray-500 text-center text-xs leading-5 px-2">
                                We drop limited invites every week - follow us{'\n'}on Instagram (
                                <Text
                                    className="text-blue-400"
                                    onPress={() => Linking.openURL('https://instagram.com/swirl.style')}
                                >
                                    instagram.com/swirl.style
                                </Text>
                                ){'\n'}to catch the next drop
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
