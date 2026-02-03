import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowRightIcon, ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useAuth } from '@/contexts/AuthContext';
import { Config } from '@/constants/Config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Login container dimensions based on specs
const LOGIN_CONTAINER_WIDTH = Math.round(353 * widthScale);
const LOGIN_CONTAINER_HEIGHT = Math.round(258 * heightScale);
const LOGIN_CONTAINER_TOP = Math.round(283.5 * heightScale);
const LOGIN_CONTAINER_LEFT = Math.round(20 * widthScale);
const LOGIN_GAP = Math.round(30 * scale);

const COUNTRIES = [
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
];

export default function PhoneLogin() {
    const router = useRouter();
    const { requestOtp } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
        setIsLoading(true);

        try {
            const { error, message } = await requestOtp(fullPhoneNumber);

            if (error) {
                Alert.alert('Error', error);
            } else {
                // Show dev hint
                if (__DEV__) {
                    console.log(`[PhoneLogin] Dev Mode - Use OTP: ${Config.DEV_OTP_CODE}`);
                }
                router.push(`/otp-verify?phone=${encodeURIComponent(fullPhoneNumber)}&countryCode=${selectedCountry.code}`);
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
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
                <View className="flex-1 px-5 pt-12">
                    {/* Progress Bar - Step 2/5 */}
                    <View className="flex-row justify-center gap-1 mb-4">
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                    </View>

                    {/* Country Code Selector */}
                    <View className="items-center mb-6">
                        <TouchableOpacity
                            className="flex-row items-center px-3 py-2"
                            onPress={() => setShowCountryPicker(true)}
                        >
                            <Text className="text-lg mr-1">{selectedCountry.flag}</Text>
                            <Text className="text-black text-base font-medium">{selectedCountry.dialCode}</Text>
                            <ChevronDownIcon size={16} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* SWIRL Logo */}
                    <View
                        className="items-center justify-center"
                        style={{
                            marginTop: Math.round(60 * heightScale),
                            marginBottom: Math.round(40 * heightScale),
                        }}
                    >
                        <Text
                            className="text-black tracking-widest"
                            style={{
                                fontSize: Math.round(32 * scale),
                                fontWeight: '600',
                                fontFamily: 'DMSans_600SemiBold',
                                fontStyle: 'italic',
                            }}
                        >
                            SWIRL.
                        </Text>
                    </View>

                    {/* Login Container */}
                    <View
                        style={{
                            width: LOGIN_CONTAINER_WIDTH,
                            alignSelf: 'center',
                            gap: LOGIN_GAP,
                        }}
                    >
                        {/* Phone Input */}
                        <View className="bg-[#F7F8DB] rounded-full flex-row items-center px-4 py-3">
                            <Text className="text-gray-500 text-base mr-2">{selectedCountry.dialCode}</Text>
                            <TextInput
                                className="flex-1 text-gray-400 text-base"
                                placeholder="Enter Phone Number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                            <TouchableOpacity
                                onPress={handleNext}
                                className="bg-[#E1E2C3] rounded-full p-2"
                            >
                                <ArrowRightIcon size={18} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {/* Or login with */}
                        <View className="items-center">
                            <Text className="text-gray-400 text-sm">Or login with</Text>
                        </View>

                        {/* Social Login Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="flex-1 bg-[#F7F8DB] py-4 rounded-full flex-row items-center justify-center">
                                <Text className="text-lg mr-2 font-bold" style={{ color: '#4285F4' }}>G</Text>
                                <Text className="text-black font-medium">Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-[#F7F8DB] py-4 rounded-full flex-row items-center justify-center">
                                <Text className="text-lg mr-2"></Text>
                                <Text className="text-black font-medium">Apple</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Invite Code Input */}
                        <View className="bg-[#F7F8DB] rounded-full flex-row items-center px-4 py-4">
                            <TextInput
                                className="flex-1 text-black text-base"
                                placeholder="Enter Invite Code"
                                placeholderTextColor="#999"
                                value={inviteCode}
                                onChangeText={setInviteCode}
                            />
                            <Text className="text-gray-400 text-sm">Optional</Text>
                        </View>
                    </View>
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
                            <Text className="text-lg font-bold text-black">Select Country Code</Text>
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
                                    <Text className="flex-1 text-base text-black">{item.name} ({item.dialCode})</Text>
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
