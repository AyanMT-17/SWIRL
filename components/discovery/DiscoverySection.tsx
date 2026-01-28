import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

interface DiscoverySectionProps {
    title: string;
    data: any[];
    cardWidth: number;
    type?: 'regular' | 'brand';
}

export default function DiscoverySection({ title, data, cardWidth, type = 'regular' }: DiscoverySectionProps) {
    return (
        <View className="px-4 mb-6">
            <Text className="text-black text-base font-bold mb-3">{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className={type === 'brand' ? "bg-white items-center justify-center" : "relative overflow-hidden"}
                            style={{
                                width: cardWidth,
                                height: type === 'brand' ? cardWidth * 0.9 : cardWidth * 1.2,
                                borderRadius: 16,
                            }}
                        >
                            <Image
                                source={{ uri: type === 'brand' ? item.logo : item.image }}
                                style={
                                    type === 'brand'
                                        ? { width: cardWidth * 0.7, height: cardWidth * 0.5 }
                                        : { width: cardWidth, height: cardWidth * 1.2, borderRadius: 16 }
                                }
                                resizeMode={type === 'brand' ? "contain" : "cover"}
                            />
                            {type !== 'brand' && (
                                <View className="absolute bottom-2 left-0 right-0 items-center">
                                    <Text
                                        className="text-white text-xs font-semibold text-center"
                                        style={{
                                            textShadowColor: 'rgba(0,0,0,0.5)',
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 3
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
