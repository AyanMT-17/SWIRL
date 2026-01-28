import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FILTER_CATEGORIES } from './data';

interface FilterSidebarProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    selectedItems: { [key: string]: string[] };
}

export default function FilterSidebar({
    selectedCategory,
    onSelectCategory,
    selectedItems
}: FilterSidebarProps) {
    return (
        <View className="w-32 bg-[#F7F8DB] py-4" style={{ borderTopRightRadius: 32, borderBottomRightRadius: 32 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20, paddingTop: 10 }}>
                <View style={{ gap: 10 }}>
                    {FILTER_CATEGORIES.map((category) => {
                        const categoryItems = selectedItems[category] || [];
                        const hasSelections = categoryItems.length > 0;

                        const isPrice = category === 'Price';
                        const hasPrice = isPrice && (
                            hasSelections ||
                            !!(selectedItems as any).priceMin ||
                            !!(selectedItems as any).priceMax
                        );

                        const isActive = selectedCategory === category;

                        return (
                            <TouchableOpacity
                                key={category}
                                onPress={() => onSelectCategory(category)}
                                className={`py-4 rounded-full border items-center justify-center ${isActive
                                    ? 'bg-black border-black'
                                    : 'bg-[#FDFFF2] border-[#E5E7B9]'
                                    }`}
                                style={{ minWidth: 80 }}
                            >
                                <Text
                                    className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {category}
                                </Text>
                                {(hasSelections || hasPrice) && !isActive && (
                                    <View className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#E8B298]" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
