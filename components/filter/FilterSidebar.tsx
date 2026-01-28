import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FILTER_CATEGORIES } from './data';

interface FilterSidebarProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function FilterSidebar({ selectedCategory, onSelectCategory }: FilterSidebarProps) {
    return (
        <View className="w-28 bg-white border-r border-gray-100">
            <ScrollView showsVerticalScrollIndicator={false}>
                {FILTER_CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onSelectCategory(category)}
                        className={`px-3 py-4 ${selectedCategory === category
                            ? 'bg-black'
                            : 'bg-white'
                            }`}
                    >
                        <Text
                            className={`text-sm ${selectedCategory === category
                                ? 'font-bold text-white'
                                : 'text-gray-600'
                                }`}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
