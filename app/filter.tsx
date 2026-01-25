import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { CheckIcon } from 'react-native-heroicons/solid';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
// Fixed dimensions
const SIDEBAR_WIDTH = 115;
const CATEGORY_ITEM_WIDTH = 90;
const CATEGORY_ITEM_HEIGHT = 40;

const CATEGORIES = [
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

const POPULAR_BRANDS = ['H&M', 'UNIQLO', 'NIKE'];
const OTHER_BRANDS = [
    { letter: 'A', brands: ['Adidas', 'All Saints', 'Asics'] },
    { letter: 'B', brands: ['Bossini', 'British Club', 'Brave Soul'] },
    { letter: 'C', brands: ['Calvin Klein', 'Cosmic'] },
];

export default function Filter() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState('Brands');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const renderCheckbox = (label: string) => {
        const isSelected = selectedBrands.includes(label);
        return (
            <TouchableOpacity
                key={label}
                onPress={() => toggleBrand(label)}
                className="flex-row items-center mb-4"
            >
                <View
                    className={`w-5 h-5 rounded-full border mr-3 items-center justify-center ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-200'
                        }`}
                >
                    {isSelected && <CheckIcon size={12} color="white" />}
                </View>
                <Text className="text-gray-500 text-base">{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-[#FDFFF2]">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View
                style={{
                    paddingTop: insets.top,
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
                className="flex-row items-center"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-[#F7F8DB] rounded-full items-center justify-center mr-4"
                >
                    <ChevronLeftIcon size={24} color="black" />
                </TouchableOpacity>
                <View className="bg-[#F7F8DB] px-6 py-2 rounded-full">
                    <Text className="text-black text-lg font-semibold">Filter</Text>
                </View>
            </View>


            <View className="flex-1 flex-row">
                {/* Left Sidebar - Figma: 113x542 at (16, 101) */}
                <View
                    style={{
                        width: SIDEBAR_WIDTH,
                        height: '80%', // approximate height to leave space for header/footer
                        marginLeft: 16,
                        backgroundColor: '#F7F8DB',
                        borderRadius: 32,
                        paddingVertical: 16,
                        paddingHorizontal: 8,
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {CATEGORIES.map((category) => {
                            const isSelected = selectedCategory === category;
                            return (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => setSelectedCategory(category)}
                                    style={{
                                        width: CATEGORY_ITEM_WIDTH,
                                        height: CATEGORY_ITEM_HEIGHT,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: isSelected ? '#000' : '#D1D1D1',
                                        backgroundColor: isSelected ? '#000' : 'transparent',
                                        paddingTop: 4,
                                        paddingBottom: 4,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        marginBottom: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            color: isSelected ? '#fff' : '#000',
                                        }}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Right Content */}
                <View className="flex-1 px-4">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        {selectedCategory === 'Brands' && (
                            <>
                                {/* Search Bar */}
                                <View className="flex-row items-center bg-[#F7F8DB] rounded-2xl px-3 py-3 mb-6">
                                    <MagnifyingGlassIcon size={20} color="black" />
                                    <TextInput
                                        className="flex-1 ml-2 text-base text-black"
                                        placeholder="Search by Brand name"
                                        placeholderTextColor="#000"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>

                                <Text className="text-black font-semibold text-base mb-4">Popular Brands</Text>
                                <View className="mb-6">
                                    {POPULAR_BRANDS.map((brand) => renderCheckbox(brand))}
                                </View>

                                {OTHER_BRANDS.map((group) => (
                                    <View key={group.letter} className="mb-6">
                                        <Text className="text-black font-bold text-lg mb-3">{group.letter}</Text>
                                        <View className="border border-blue-400 p-2 rounded-lg mb-2 hidden">
                                            {/* Debug outline for the requested focus area in image, removing hidden in real code if needed or just implementing logic */}
                                        </View>
                                        {group.brands.map((brand) => renderCheckbox(brand))}
                                    </View>
                                ))}
                            </>
                        )}
                        {selectedCategory !== 'Brands' && (
                            <View className="flex-1 items-center justify-center mt-20">
                                <Text className="text-gray-400">Options for {selectedCategory}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>

            {/* Footer */}
            <View
                className="absolute bottom-0 left-0 right-0 p-4 bg-[#FDFFF2] border-t border-gray-100 flex-row justify-between items-center"
                style={{ paddingBottom: insets.bottom + 16 }}
            >
                <TouchableOpacity className="flex-1 mr-3 bg-[#F7F8DB] py-4 rounded-2xl items-center border border-[#E5E5E5]">
                    <Text className="text-black font-semibold text-base">Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 ml-3 bg-[#E8B298] py-4 rounded-2xl items-center">
                    <Text className="text-black font-semibold text-base">Apply Filter</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}
