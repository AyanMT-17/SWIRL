import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowTrendingUpIcon, SparklesIcon, StarIcon, TagIcon, Bars3BottomLeftIcon } from 'react-native-heroicons/outline';
import {
    PRIMARY_CATEGORIES,
    SECONDARY_CATEGORIES,
    SEARCH_PRIMARY_CATEGORIES,
    SEARCH_SECONDARY_CATEGORIES,
    BUTTON_SIZE
} from './constants';

interface CategoryFilterProps {
    isSearchFocused: boolean;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onFilterPress: () => void;
}

export default function CategoryFilter({
    isSearchFocused,
    selectedCategory,
    onCategoryChange,
    onFilterPress
}: CategoryFilterProps) {
    if (isSearchFocused) {
        return (
            <View style={{ paddingHorizontal: 8 }}>
                {/* First Row */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                >
                    {SEARCH_PRIMARY_CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => onCategoryChange(category)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 9999,
                                borderWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                backgroundColor: selectedCategory === category ? '#000' : '#fff',
                                borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                            }}
                        >
                            {category === 'Trending' && (
                                <ArrowTrendingUpIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />
                            )}
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    fontFamily: 'DMSans_600SemiBold',
                                    color: selectedCategory === category ? '#fff' : '#111827',
                                }}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Second Row */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                >
                    {SEARCH_SECONDARY_CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => onCategoryChange(category)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 9999,
                                borderWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                backgroundColor: selectedCategory === category ? '#000' : '#fff',
                                borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                            }}
                        >
                            {category === 'Lite' && <SparklesIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                            {category === 'Premium' && <StarIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                            {category === 'Luxe' && <SparklesIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                            {category === 'Street wear' && <TagIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    fontFamily: 'DMSans_600SemiBold',
                                    color: selectedCategory === category ? '#fff' : '#111827',
                                }}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{ paddingLeft: 8 }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 20 }}
            >
                <TouchableOpacity
                    style={{
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderRadius: BUTTON_SIZE / 2,
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        marginRight: 4,
                    }}
                    onPress={onFilterPress}
                >
                    <Bars3BottomLeftIcon size={20} color="#000" />
                </TouchableOpacity>

                {/* Primary Categories */}
                {PRIMARY_CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onCategoryChange(category)}
                        style={{
                            paddingHorizontal: selectedCategory === category ? 16 : 24,
                            paddingVertical: 10,
                            borderRadius: 9999,
                            borderWidth: 1,
                            backgroundColor: selectedCategory === category ? '#000' : '#fff',
                            borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                            minWidth: selectedCategory === category ? 44 : 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'DMSans_600SemiBold',
                                color: selectedCategory === category ? '#fff' : '#111827',
                            }}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Separator */}
                <View style={{
                    height: 32,
                    width: 1,
                    backgroundColor: '#d1d5db',
                    marginHorizontal: 12,
                    alignSelf: 'center'
                }} />

                {/* Secondary Categories */}
                {SECONDARY_CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onCategoryChange(category)}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 9999,
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: selectedCategory === category ? '#000' : '#fff',
                            borderColor: selectedCategory === category ? '#000' : '#d1d5db',
                        }}
                    >
                        {category === 'Lite' && <SparklesIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                        {category === 'Premium' && <StarIcon size={14} color={selectedCategory === category ? '#fff' : '#000'} />}
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'DMSans_600SemiBold',
                                color: selectedCategory === category ? '#fff' : '#111827',
                            }}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
