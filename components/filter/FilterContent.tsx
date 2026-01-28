import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MagnifyingGlassIcon, CheckIcon } from 'react-native-heroicons/outline';
import {
    BRAND_DATA,
    CLOTHING_SIZE_OPTIONS,
    SHOE_SIZE_OPTIONS,
    TOP_OPTIONS,
    BOTTOM_OPTIONS,
    PRICE_RANGES,
    SHOES_OPTIONS,
    ACCESSORIES_OPTIONS,
    DRESS_OPTIONS,
    LIFESTYLE_OPTIONS,
    COLOR_OPTIONS
} from './data';

interface FilterContentProps {
    selectedCategory: string;
    selectedItems: { [key: string]: string[] };
    handleToggleItem: (category: string, item: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    priceMin: string;
    setPriceMin: (price: string) => void;
    priceMax: string;
    setPriceMax: (price: string) => void;
}

export default function FilterContent({
    selectedCategory,
    selectedItems,
    handleToggleItem,
    searchQuery,
    setSearchQuery,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax
}: FilterContentProps) {

    const isItemSelected = (category: string, item: string) => {
        return (selectedItems[category] || []).includes(item);
    };

    const renderBrandsContent = () => (
        <View className="flex-1">
            <View className="px-4 py-3">
                <View className="bg-white rounded-xl px-3 py-2.5 flex-row items-center border border-gray-200">
                    <MagnifyingGlassIcon size={16} color="#888" />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-900"
                        placeholder="Search by Brand name"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {Object.entries(BRAND_DATA).map(([section, brands]) => {
                    const filteredBrands = searchQuery
                        ? brands.filter(brand =>
                            brand.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        : brands;

                    if (filteredBrands.length === 0) return null;

                    return (
                        <View key={section} className="mb-4">
                            <Text className="text-sm font-bold text-gray-900 mb-2">
                                {section}
                            </Text>
                            <View className="gap-1">
                                {filteredBrands.map(brand => (
                                    <TouchableOpacity
                                        key={brand}
                                        onPress={() => handleToggleItem('Brands', brand)}
                                        className="flex-row items-center py-2"
                                    >
                                        <View
                                            className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${isItemSelected('Brands', brand)
                                                ? 'bg-black border-black'
                                                : 'bg-white border-gray-300'
                                                }`}
                                        >
                                            {isItemSelected('Brands', brand) && (
                                                <CheckIcon size={12} color="#fff" strokeWidth={3} />
                                            )}
                                        </View>
                                        <Text className="text-sm text-gray-700">{brand}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

    const renderSizeContent = () => (
        <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <Text className="text-sm font-bold text-gray-900 mb-3">Clothing Sizes</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
                {CLOTHING_SIZE_OPTIONS.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => handleToggleItem('Size', option)}
                        className={`px-5 py-2.5 rounded-full border ${isItemSelected('Size', option)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${isItemSelected('Size', option)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="text-sm font-bold text-gray-900 mb-3">Shoe Sizes</Text>
            <View className="flex-row flex-wrap gap-2">
                {SHOE_SIZE_OPTIONS.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => handleToggleItem('ShoeSize', option)}
                        className={`px-4 py-2.5 rounded-full border ${isItemSelected('ShoeSize', option)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${isItemSelected('ShoeSize', option)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderShoesContent = () => (
        <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <Text className="text-sm font-bold text-gray-900 mb-3">Shoe Types</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
                {SHOES_OPTIONS.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => handleToggleItem('Shoes', option)}
                        className={`px-4 py-2.5 rounded-full border ${isItemSelected('Shoes', option)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${isItemSelected('Shoes', option)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text className="text-sm font-bold text-gray-900 mb-3">Shoe Sizes (UK)</Text>
            <View className="flex-row flex-wrap gap-2">
                {SHOE_SIZE_OPTIONS.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => handleToggleItem('ShoeSize', option)}
                        className={`px-4 py-2.5 rounded-full border ${isItemSelected('ShoeSize', option)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${isItemSelected('ShoeSize', option)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderPillOptions = (options: string[], category: string) => (
        <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <View className="flex-row flex-wrap gap-2">
                {options.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => handleToggleItem(category, option)}
                        className={`px-5 py-2.5 rounded-full border ${isItemSelected(category, option)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${isItemSelected(category, option)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderPriceContent = () => (
        <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <View className="flex-row flex-wrap gap-2 mb-6">
                {PRICE_RANGES.map(range => (
                    <TouchableOpacity
                        key={range}
                        onPress={() => handleToggleItem('Price', range)}
                        className={`px-4 py-2.5 rounded-full border ${isItemSelected('Price', range)
                            ? 'bg-black border-black'
                            : 'bg-white border-gray-300'
                            }`}
                    >
                        <Text
                            className={`text-xs font-medium ${isItemSelected('Price', range)
                                ? 'text-white'
                                : 'text-gray-700'
                                }`}
                        >
                            {range}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="flex-row items-center gap-3">
                <View className="flex-1 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                    <TextInput
                        className="text-sm text-gray-900"
                        placeholder="Min"
                        placeholderTextColor="#888"
                        value={priceMin}
                        onChangeText={setPriceMin}
                        keyboardType="numeric"
                    />
                </View>
                <Text className="text-gray-400">-</Text>
                <View className="flex-1 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                    <TextInput
                        className="text-sm text-gray-900"
                        placeholder="Max"
                        placeholderTextColor="#888"
                        value={priceMax}
                        onChangeText={setPriceMax}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </ScrollView>
    );

    switch (selectedCategory) {
        case 'Brands':
            return renderBrandsContent();
        case 'Size':
            return renderSizeContent();
        case 'Top':
            return renderPillOptions(TOP_OPTIONS, 'Top');
        case 'Bottom':
            return renderPillOptions(BOTTOM_OPTIONS, 'Bottom');
        case 'Price':
            return renderPriceContent();
        case 'Shoes':
            return renderShoesContent();
        case 'Accessories':
            return renderPillOptions(ACCESSORIES_OPTIONS, 'Accessories');
        case 'Dress':
            return renderPillOptions(DRESS_OPTIONS, 'Dress');
        case 'Lifestyle':
            return renderPillOptions(LIFESTYLE_OPTIONS, 'Lifestyle');
        case 'Color':
            return renderPillOptions(COLOR_OPTIONS, 'Color');
        default:
            return null;
    }
}
