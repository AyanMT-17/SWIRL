import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { CameraIcon, MicrophoneIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiscoveryHeaderProps {
    insets: { top: number };
    router: any;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isListening: boolean;
    handleCamera: () => void;
    handleMic: () => void;
}

export default function DiscoveryHeader({
    insets,
    router,
    searchQuery,
    setSearchQuery,
    isListening,
    handleCamera,
    handleMic
}: DiscoveryHeaderProps) {
    return (
        <View
            style={{
                paddingTop: insets.top,
                width: SCREEN_WIDTH,
                height: 100 + insets.top,
                backgroundColor: '#FDFFF2',
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                justifyContent: 'center',
            }}
        >
            <View className="flex-row items-center px-4 w-full">
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        marginRight: 12
                    }}
                >
                    <LeftArrowIcon size={44} color="#000" />
                </TouchableOpacity>

                {/* Search Bar */}
                <View
                    className="flex-1 flex-row items-center px-3"
                    style={{
                        backgroundColor: '#F7F8DB',
                        borderRadius: 16,
                        height: 44,
                    }}
                >
                    <MagnifyingGlassIcon size={16} color="#000" />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-black"
                        placeholder={isListening ? "Listening..." : "Looking for something today?"}
                        placeholderTextColor={isListening ? "#ff0000" : "#000"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    <TouchableOpacity className="ml-2" onPress={handleCamera}>
                        <CameraIcon size={20} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity className="ml-2" onPress={handleMic}>
                        <MicrophoneIcon size={20} color={isListening ? "red" : "#000"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
