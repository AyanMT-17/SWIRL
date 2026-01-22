import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronRightIcon, XMarkIcon } from 'react-native-heroicons/outline';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Button dimensions based on iPhone 16 specs
const BUTTON_HEIGHT = Math.round(86 * heightScale);
const BUTTON_BORDER_RADIUS = Math.round(24 * scale);

// Country list with flags
const COUNTRIES = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
];

export default function LocationSelect() {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleNext = () => {
        router.push('/phone-login');
    };

    const handleSelectCountry = (country: typeof COUNTRIES[0]) => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    {/* Segmented Progress Bar - Step 1/5 */}
                    <View className="flex-row justify-center gap-1 mb-8">
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                    </View>

                    <Text className="text-black text-2xl font-bold text-center mb-4">
                        Where do you live?
                    </Text>
                    <Text className="text-gray-500 text-center mb-12 px-4 leading-6 text-sm">
                        This helps us find clothing that is perfectly altered to your taste.Don't worry we won't show it on your profile
                    </Text>

                    {/* Country Selector */}
                    <TouchableOpacity
                        onPress={() => setShowCountryPicker(true)}
                        className="border-b border-gray-200 flex-row items-center px-2 py-4 mb-4"
                    >
                        <Text className="text-2xl mr-3">{selectedCountry.flag}</Text>
                        <Text className="flex-1 text-black text-base">{selectedCountry.name}</Text>
                        <ChevronRightIcon size={20} color="#ccc" />
                    </TouchableOpacity>

                    <View className="flex-1" />

                    {/* Next Button - Full width, responsive height */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            backgroundColor: '#E4AD82',
                            height: BUTTON_HEIGHT,
                            borderRadius: BUTTON_BORDER_RADIUS,
                            width: SCREEN_WIDTH,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginBottom: 16,
                            marginHorizontal: -24,
                        }}
                    >
                        <Text className="text-black text-center font-semibold text-lg">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl" style={{ maxHeight: SCREEN_HEIGHT * 0.7 }}>
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <Text className="text-lg font-bold text-black">Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <XMarkIcon size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Country List */}
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectCountry(item)}
                                    className={`flex-row items-center px-6 py-4 border-b border-gray-100 ${selectedCountry.code === item.code ? 'bg-gray-50' : ''
                                        }`}
                                >
                                    <Text className="text-2xl mr-4">{item.flag}</Text>
                                    <Text className="flex-1 text-base text-black">{item.name}</Text>
                                    {selectedCountry.code === item.code && (
                                        <View className="w-5 h-5 rounded-full bg-[#ccfd51] items-center justify-center">
                                            <Text className="text-black text-xs">✓</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}
