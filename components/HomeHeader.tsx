import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { MagnifyingGlassIcon, BellIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="absolute top-0 left-0 right-0 z-50 overflow-hidden"
            style={{ paddingTop: insets.top }}
        >
            {/* Glass Effect Background */}
            <BlurView intensity={80} tint="light" className="absolute inset-0" style={{ height: 120 }} />

            <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
                {/* Brand / Logo Area */}
                <View>
                    <Text className="text-3xl font-black text-black tracking-tighter">
                        SWIRL.
                    </Text>
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest -mt-1 ml-0.5">
                        Est. 2024
                    </Text>
                </View>

                {/* Right Actions */}
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="bg-white/50 p-2.5 rounded-full border border-black/5">
                        <MagnifyingGlassIcon size={22} color="#111" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white/50 p-2.5 rounded-full border border-black/5 relative">
                        <BellIcon size={22} color="#111" strokeWidth={2.5} />
                        <View className="absolute top-2 right-2.5 w-2 h-2 bg-[#ff3b30] rounded-full ring-2 ring-white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
