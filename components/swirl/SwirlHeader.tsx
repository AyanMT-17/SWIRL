import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';

interface SwirlHeaderProps {
    insets: { top: number };
    activeTab: 'swirls' | 'collection';
    setActiveTab: (tab: 'swirls' | 'collection') => void;
}

const HEADER_BORDER_RADIUS = 24;

export default function SwirlHeader({ insets, activeTab, setActiveTab }: SwirlHeaderProps) {
    return (
        <View
            style={{
                backgroundColor: '#FDFFF2',
                zIndex: 50,
                overflow: 'hidden',
                borderRadius: HEADER_BORDER_RADIUS,
                paddingTop: Math.max(insets.top, 44),
                paddingBottom: 16,
                paddingHorizontal: 16,
            }}
        >
            <View className="flex-row items-center">
                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <LeftArrowIcon size={32} color="#000" />
                </TouchableOpacity>

                {/* Tab Switcher - Centered */}
                <View className="flex-1 flex-row justify-center gap-10">
                    <TouchableOpacity onPress={() => setActiveTab('swirls')}>
                        <Text className={`text-base font-semibold ${activeTab === 'swirls' ? 'text-gray-900' : 'text-gray-400'} `}>
                            My SWIRLs
                        </Text>
                        {activeTab === 'swirls' && (
                            <View className="h-0.5 bg-[#ccfd51] mt-1 rounded-full w-24" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab('collection')}>
                        <Text className={`text-base font-semibold ${activeTab === 'collection' ? 'text-gray-900' : 'text-gray-400'} `}>
                            My Collection
                        </Text>
                        {activeTab === 'collection' && (
                            <View className="h-0.5 bg-[#ccfd51] mt-1 rounded-full w-24" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Empty spacer for balance */}
                <View className="w-10 h-10" />
            </View>
        </View>
    );
}
