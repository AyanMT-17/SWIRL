import { View, Text, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ChevronLeftIcon, BackspaceIcon } from 'react-native-heroicons/outline';
import { useAuth } from '@/contexts/AuthContext';
import { Config } from '@/constants/Config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

export default function OtpVerify() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const { verifyOtp, needsOnboarding } = useAuth();
    const [code, setCode] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    // Mask phone number for display
    const maskPhone = (phoneNum: string) => {
        if (!phoneNum) return '+917004 54XX3X';
        const clean = phoneNum.replace(/\D/g, '');
        if (clean.length >= 10) {
            return `+91${clean.slice(0, 4)}${clean.slice(4, 6)}XX${clean.slice(-2)}X`;
        }
        return phoneNum;
    };

    const handleVerifyOtp = async (otpCode: string) => {
        setIsLoading(true);

        try {
            const { error, user } = await verifyOtp(phone as string, otpCode);

            if (error) {
                Alert.alert('Error', error);
                // Reset code on error
                setCode(['', '', '', '']);
            } else {
                // Success - navigate based on onboarding status
                console.log('[OtpVerify] Login successful, needsOnboarding:', needsOnboarding);
                router.replace('/gender-select');
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Verification failed');
            setCode(['', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNumberPress = (num: string) => {
        if (isLoading) return;

        const nextIndex = code.findIndex(digit => digit === '');
        if (nextIndex !== -1) {
            const newCode = [...code];
            newCode[nextIndex] = num;
            setCode(newCode);

            // Auto-submit if filled
            if (nextIndex === 3) {
                const otpCode = newCode.join('');
                handleVerifyOtp(otpCode);
            }
        }
    };

    const handleDelete = () => {
        if (isLoading) return;

        const lastIndex = code.map((val, i) => val !== '' ? i : -1).filter(i => i !== -1).pop();
        if (lastIndex !== undefined) {
            const newCode = [...code];
            newCode[lastIndex] = '';
            setCode(newCode);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-12">
                {/* Header with back button and centered progress bar */}
                <View className="relative mb-8">
                    {/* Back button - absolutely positioned */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 top-0 z-10"
                    >
                        <ChevronLeftIcon size={24} color="black" />
                    </TouchableOpacity>

                    {/* Progress Bar - Step 3/5 - Centered */}
                    <View className="flex-row justify-center gap-1">
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                        <View className="h-1 w-8 bg-gray-200 rounded-full" />
                    </View>
                </View>

                {/* Title and subtitle */}
                <View className="items-center mb-8 mt-8">
                    <Text className="text-black text-xl font-bold mb-2 text-center">
                        Help us to verify your account
                    </Text>
                    <Text className="text-gray-400 text-sm">
                        we've sent a code to {maskPhone(phone as string)}
                    </Text>
                    {/* Dev mode hint */}
                    {__DEV__ && (
                        <Text className="text-blue-500 text-xs mt-2">
                            Dev Mode: Use OTP {Config.DEV_OTP_CODE}
                        </Text>
                    )}
                    {/* Loading indicator */}
                    {isLoading && (
                        <ActivityIndicator size="small" color="#ccfd51" style={{ marginTop: 8 }} />
                    )}
                </View>

                {/* OTP Input Circles */}
                <View className="flex-row justify-center gap-4 mb-12">
                    {code.map((digit, index) => (
                        <View
                            key={index}
                            className="items-center justify-center"
                            style={{
                                width: Math.round(60 * scale),
                                height: Math.round(60 * scale),
                                borderRadius: Math.round(30 * scale),
                                backgroundColor: index === 0 && !digit ? '#F7F8DB' : '#E8E8E8',
                            }}
                        >
                            <Text className="text-2xl font-bold text-black">{digit}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Custom Numeric Keypad */}
            <View className="bg-[#F5F5F5] px-4 pt-4 pb-8">
                {/* Row 1: 1 2 3 */}
                <View className="flex-row mb-1">
                    {[1, 2, 3].map(num => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handleNumberPress(num.toString())}
                            className="flex-1 items-center py-4 bg-white m-0.5"
                            style={{ borderRadius: 4 }}
                        >
                            <Text className="text-xl font-medium text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Row 2: 4 5 6 */}
                <View className="flex-row mb-1">
                    {[4, 5, 6].map(num => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handleNumberPress(num.toString())}
                            className="flex-1 items-center py-4 bg-white m-0.5"
                            style={{ borderRadius: 4 }}
                        >
                            <Text className="text-xl font-medium text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Row 3: 7 8 9 */}
                <View className="flex-row mb-1">
                    {[7, 8, 9].map(num => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handleNumberPress(num.toString())}
                            className="flex-1 items-center py-4 bg-white m-0.5"
                            style={{ borderRadius: 4 }}
                        >
                            <Text className="text-xl font-medium text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Row 4: empty, 0, delete */}
                <View className="flex-row">
                    <View className="flex-1 m-0.5" />
                    <TouchableOpacity
                        onPress={() => handleNumberPress('0')}
                        className="flex-1 items-center py-4 bg-white m-0.5"
                        style={{ borderRadius: 4 }}
                    >
                        <Text className="text-xl font-medium text-black">0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-1 items-center justify-center py-4 m-0.5"
                    >
                        <BackspaceIcon size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
