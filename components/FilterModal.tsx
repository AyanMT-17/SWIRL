import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterSidebar from '@/components/filter/FilterSidebar';
import FilterContent from '@/components/filter/FilterContent';
import { FilterState } from '@/components/filter/data';

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
                    <FilterSidebar
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />

                    <View className="flex-1 bg-[#F5F3EE]">
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
