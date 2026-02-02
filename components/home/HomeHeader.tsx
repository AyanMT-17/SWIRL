import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';
import SearchButtonIcon from '@/components/icons/SearchButtonIcon';
import ReloadIcon from '@/components/icons/ReloadIcon';
import CategoryFilter from './CategoryFilter';
import { HEADER_BORDER_RADIUS, BUTTON_SIZE } from './constants';

interface HomeHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchFocused: boolean;
    setIsSearchFocused: (focused: boolean) => void;
    handleReset: () => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedSubcategory: string | null;
    onSubcategoryChange: (subcategory: string) => void;
    onFilterPress: () => void;
}

export default function HomeHeader({
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    handleReset,
    selectedCategory,
    onCategoryChange,
    selectedSubcategory,
    onSubcategoryChange,
    onFilterPress
}: HomeHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                backgroundColor: '#FDFFF2',
                zIndex: 50,
                overflow: 'hidden',
                borderRadius: HEADER_BORDER_RADIUS,
                paddingTop: insets.top + 10,
                paddingBottom: 10,
                paddingHorizontal: 16,
            }}
        >
            {/* Top Row - Search Bar */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 8,
                marginBottom: 16,
            }}>
                <TouchableOpacity
                    style={{
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: BUTTON_SIZE / 2,
                    }}
                    onPress={() => {
                        if (isSearchFocused) {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                        }
                    }}
                >
                    <LeftArrowIcon size={BUTTON_SIZE} />
                </TouchableOpacity>

                <View style={{
                    flex: 1,
                    height: 40,
                    backgroundColor: '#F7F8DB',
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: '500',
                            fontFamily: 'DMSans_500Medium',
                            color: '#1f2937',
                            textAlign: 'left',
                            paddingVertical: 0,
                        }}
                        placeholder={isSearchFocused ? "What should i wear to the beach?" : "What's your vibe today?"}
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setIsSearchFocused(true)}
                    />
                </View>

                <TouchableOpacity
                    style={{
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: BUTTON_SIZE / 2,
                    }}
                    onPress={isSearchFocused ? () => { } : handleReset}
                >
                    {isSearchFocused ? (
                        <SearchButtonIcon size={BUTTON_SIZE} color="#000" />
                    ) : (
                        <ReloadIcon size={BUTTON_SIZE} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Category Filters */}
            <CategoryFilter
                isSearchFocused={isSearchFocused}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                selectedSubcategory={selectedSubcategory}
                onSubcategoryChange={onSubcategoryChange}
                onFilterPress={onFilterPress}
            />
        </View>
    );
}
