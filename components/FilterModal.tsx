import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
} from 'react-native';
import { ChevronLeftIcon, MagnifyingGlassIcon, CheckIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PREMIUM_BRANDS } from '@/constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Filter categories for left sidebar
const FILTER_CATEGORIES = [
    'Brands',
    'Size',
    'Top',
    'Bottom',
    'Price',
    'Shoes',
    'Accessories',
    'Dress',
    'Lifestyle',
    'Color',
];

// Dynamically generate brand data from PREMIUM_BRANDS
const generateBrandData = () => {
    const data: { [key: string]: string[] } = {
        'Popular Brands': ['Roadster', 'HRX by Hrithik Roshan', 'Nike', 'H&M', 'Miniorange']
    };

    PREMIUM_BRANDS.forEach(brand => {
        const firstLetter = brand.name[0].toUpperCase();
        if (!data[firstLetter]) {
            data[firstLetter] = [];
        }
        data[firstLetter].push(brand.name);
    });

    // Sort brands within letters
    Object.keys(data).forEach(key => {
        if (key !== 'Popular Brands') {
            data[key].sort();
        }
    });

    return data;
};

const BRAND_DATA = generateBrandData();

// Clothing size options
const CLOTHING_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

// Shoe size options (UK sizes)
const SHOE_SIZE_OPTIONS = ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

// Top clothing types
const TOP_OPTIONS = ['Shirts', 'T-Shirts', 'Jackets', 'Sweaters', 'Sweatshirts', 'Hoodie', 'Kurta', 'Zippers'];

// Bottom clothing types
const BOTTOM_OPTIONS = ['Denims', 'Chinos', 'Cargos', 'Joggers', 'Trousers', 'Pants', 'Pajamas', 'Shorts'];

// Price ranges
const PRICE_RANGES = [
    'Below Rs.500',
    'Rs.500 - Rs.1000',
    'Rs.1001 - Rs.1500',
    'Rs.1501 - Rs.2000',
    'Rs.2000 - Rs.2500',
    'Rs.2501 - Rs.5000',
    'Rs.5001 - Rs.10000',
    'Above Rs.10000',
];

// Shoes types
const SHOES_OPTIONS = ['Sneakers', 'Loafers', 'Boots', 'Sandals', 'Formal Shoes', 'Sports Shoes', 'Slip-ons', 'High Tops'];

// Accessories options
const ACCESSORIES_OPTIONS = ['Watches', 'Bags', 'Belts', 'Wallets', 'Sunglasses', 'Caps', 'Scarves', 'Ties'];

// Dress options
const DRESS_OPTIONS = ['Casual Dress', 'Formal Dress', 'Party Wear', 'Traditional', 'Western', 'Maxi', 'Mini', 'Midi'];

// Lifestyle options
const LIFESTYLE_OPTIONS = ['Sports', 'Casual', 'Formal', 'Ethnic', 'Street Style', 'Bohemian', 'Minimalist', 'Vintage'];

// Color options
const COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Grey', 'Brown', 'Navy', 'Beige', 'Orange'];

export interface FilterState {
    selectedCategory: string;
    selectedItems: { [key: string]: string[] };
    searchQuery: string;
    priceMin: string;
    priceMax: string;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilter: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export default function FilterModal({
    visible,
    onClose,
    onApplyFilter,
    initialFilters,
}: FilterModalProps) {
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState('Brands');
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');

    useEffect(() => {
        if (initialFilters) {
            setSelectedCategory(initialFilters.selectedCategory);
            setSelectedItems(initialFilters.selectedItems);
            setSearchQuery(initialFilters.searchQuery);
            setPriceMin(initialFilters.priceMin || '');
            setPriceMax(initialFilters.priceMax || '');
        }
    }, [initialFilters]);

    const handleToggleItem = (category: string, item: string) => {
        setSelectedItems(prev => {
            const currentItems = prev[category] || [];
            if (currentItems.includes(item)) {
                return {
                    ...prev,
                    [category]: currentItems.filter(i => i !== item),
                };
            } else {
                return {
                    ...prev,
                    [category]: [...currentItems, item],
                };
            }
        });
    };

    const isItemSelected = (category: string, item: string) => {
        return (selectedItems[category] || []).includes(item);
    };

    const handleReset = () => {
        setSelectedItems({});
        setSearchQuery('');
        setPriceMin('');
        setPriceMax('');
    };

    const handleApply = () => {
        onApplyFilter({
            selectedCategory,
            selectedItems,
            searchQuery,
            priceMin,
            priceMax,
        });
        onClose();
    };

    // Render content based on selected category
    const renderContent = () => {
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
    };

    // Render brands with search and alphabetical sections
    const renderBrandsContent = () => (
        <View className="flex-1">
            {/* Search Bar */}
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

            {/* Brand Sections */}
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

    // Render size content with clothing sizes
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

    // Render shoes content with shoe types and sizes
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

    // Render pill/button options for Top, Bottom, etc.
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

    // Render price content with ranges and min/max input
    const renderPriceContent = () => (
        <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            {/* Price Range Pills */}
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

            {/* Min/Max Input */}
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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View
                className="flex-1 bg-[#F5F3EE]"
                style={{ paddingTop: insets.top }}
            >
                {/* Header */}
                <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                    <TouchableOpacity onPress={onClose} className="mr-3">
                        <ChevronLeftIcon size={24} color="#000" strokeWidth={2} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900">Filter</Text>
                </View>

                {/* Main Content */}
                <View className="flex-1 flex-row">
                    {/* Left Sidebar - Categories */}
                    <View className="w-28 bg-white border-r border-gray-100">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {FILTER_CATEGORIES.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => setSelectedCategory(category)}
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

                    {/* Right Content */}
                    <View className="flex-1 bg-[#F5F3EE]">
                        {renderContent()}
                    </View>
                </View>

                {/* Bottom Buttons */}
                <View
                    className="flex-row px-4 py-4 bg-[#F5F3EE] border-t border-gray-200"
                    style={{ paddingBottom: insets.bottom + 16 }}
                >
                    <TouchableOpacity
                        onPress={handleReset}
                        className="flex-1 py-3.5 rounded-full border border-gray-300 bg-white mr-3"
                    >
                        <Text className="text-center text-gray-900 font-semibold">Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleApply}
                        className="flex-1 py-3.5 rounded-full bg-[#E8B298]"
                    >
                        <Text className="text-center text-gray-900 font-bold">Apply Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
