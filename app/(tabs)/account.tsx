import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ChevronRightIcon,
    UserIcon,
    QuestionMarkCircleIcon,
    MicrophoneIcon,
    SparklesIcon,
    Squares2X2Icon,
    ChevronLeftIcon
} from 'react-native-heroicons/outline';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
// Fixed dimensions
const HEADER_BORDER_RADIUS = 24;
const FEED_BORDER_RADIUS = 24;

const MENU_ITEMS = [
    { icon: UserIcon, label: 'My account', subLabel: 'view and edit your profile details', route: '/my-account', isModal: false },
    { icon: MicrophoneIcon, label: 'Speak to the founder', subLabel: 'Report an issue or share your thoughts', route: '/support', isModal: true },
    { icon: SparklesIcon, label: 'My vibe', subLabel: 'Change your vibe preference and size', route: '/vibe', isModal: true },
    { icon: Squares2X2Icon, label: 'Connect your Pinterest board', subLabel: 'Coming soon!', route: '/pinterest', isModal: true },
    { icon: QuestionMarkCircleIcon, label: 'Show app tutorial', route: '/tutorial', isModal: true },
];

export default function Account() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signOut, user } = useAuth();

    const handleNavigation = (item: typeof MENU_ITEMS[0]) => {
        if (item.label === 'Connect your Pinterest board') {
            return;
        }

        if (item.isModal && item.route !== '/support') {
            // Alert.alert('Coming Soon', `${item.label} will be available in the next update!`);
            console.log('Menu item clicked (Coming Soon):', item.label);
            return;
        }

        if (item.route.startsWith('/')) {
            // @ts-ignore
            router.push(item.route);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: 94 }}>
            {/* Floating Header with greeting and invite */}
            <View
                style={{
                    backgroundColor: '#FDFFF2',
                    zIndex: 50,
                    overflow: 'hidden',
                    borderRadius: HEADER_BORDER_RADIUS,
                    paddingTop: Math.max(insets.top, 44),
                    paddingBottom: 20,
                    paddingHorizontal: 20,
                }}
            >
                <View>
                    <Text className="text-2xl font-normal text-black tracking-tight mb-3">Hey, {user?.name || 'User'}</Text>
                    <TouchableOpacity
                        className="bg-[#E5B58D] py-2.5 px-5 rounded-full flex-row items-center self-start"
                        onPress={() => { }}
                    >
                        <UserIcon size={16} color="#000" strokeWidth={1.5} />
                        <Text className="font-medium text-sm text-black ml-2">Invite friends</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Component (Feed) */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FDFFF2',
                    marginTop: 3,
                    borderRadius: FEED_BORDER_RADIUS,
                    overflow: 'hidden',
                }}
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Menu Items */}
                    <View className="px-0 pt-4">
                        {MENU_ITEMS.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleNavigation(item)}
                                className={`flex-row items-center py-5 px-6 ${idx !== MENU_ITEMS.length - 1 ? 'border-b border-[#F0EFE9]' : ''
                                    }`}
                            >
                                <View className="mr-4">
                                    <item.icon size={24} color="#1A1A1A" strokeWidth={1.5} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-normal text-black mb-0.5">
                                        {item.label}
                                    </Text>
                                    {item.subLabel && (
                                        <Text className="text-[#A09F99] text-sm font-normal">
                                            {item.subLabel}
                                        </Text>
                                    )}
                                </View>
                                {item.label !== 'Connect your Pinterest board' && (
                                    <ChevronRightIcon size={20} color="#1A1A1A" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sign Out Button */}
                    <TouchableOpacity
                        onPress={async () => {
                            console.log('[Account] Sign Out button pressed');
                            try {
                                await signOut();
                                console.log('[Account] signOut() finished, replacing route...');
                                router.replace('/onboarding');
                            } catch (e) {
                                console.error('[Account] Error during sign out:', e);
                                // Fallback redirect
                                router.replace('/onboarding');
                            }
                        }}
                        className="mx-6 mt-8 py-4 border-t border-[#F0EFE9] items-center"
                    >
                        <Text className="text-red-500 font-medium text-base">Sign Out</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </View>
    );
}
