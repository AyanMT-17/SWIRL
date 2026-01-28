import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterSidebar from '@/components/filter/FilterSidebar';
import FilterContent from '@/components/filter/FilterContent';
import { FilterState } from '@/components/filter/data';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FOOTER_HEIGHT = 90; // Height of the CustomTabBar

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilter: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export { FilterState };

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

    // Animation state
    const animation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [shouldRender, setShouldRender] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            Animated.spring(animation, {
                toValue: 0,
                useNativeDriver: true,
                tension: 40,
                friction: 8
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start(() => setShouldRender(false));
        }
    }, [visible]);

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

    if (!shouldRender) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: FOOTER_HEIGHT + 2,
                backgroundColor: '#FDFFF2',
                zIndex: 1000,
                transform: [{ translateY: animation }],
                paddingTop: 20,
                borderRadius: 32, // Large rounded corners for the whole modal
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10
            }}
        >
            {/* Header */}
            <View
                className="flex-row items-center px-6 py-4"
                style={{ backgroundColor: '#FDFFF2' }}
            >
                <TouchableOpacity
                    onPress={onClose}
                    className="w-10 h-10 rounded-2xl bg-[#F2F4C3] items-center justify-center mr-4"
                >
                    <ChevronLeftIcon size={20} color="#000" strokeWidth={2.5} />
                </TouchableOpacity>

                <View className="bg-[#F2F4C3] px-6 py-2 rounded-2xl">
                    <Text className="text-sm font-bold text-gray-900">Filter</Text>
                </View>
            </View>

            {/* Main Content */}
            <View className="flex-1 flex-row">
                <FilterSidebar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedItems={{
                        ...selectedItems,
                        priceMin,
                        priceMax
                    } as any}
                />

                <View className="flex-1 bg-[#FDFFF2]">
                    <FilterContent
                        selectedCategory={selectedCategory}
                        selectedItems={selectedItems}
                        handleToggleItem={handleToggleItem}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        priceMin={priceMin}
                        setPriceMin={setPriceMin}
                        priceMax={priceMax}
                        setPriceMax={setPriceMax}
                    />
                </View>
            </View>

            {/* Bottom Buttons Bar */}
            <View
                className="flex-row px-4 py-6"
                style={{
                    backgroundColor: '#FDFFF2',
                }}
            >
                <TouchableOpacity
                    onPress={handleReset}
                    className="flex-1 py-4 rounded-2xl border border-[#E5E7B9] bg-[#F7F8DB] mr-4"
                >
                    <Text className="text-center text-gray-900 font-bold">Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleApply}
                    className="flex-1 py-4 rounded-2xl bg-[#E8B298]"
                >
                    <Text className="text-center text-gray-900 font-bold">Apply Filter</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
