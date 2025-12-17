import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Delete, ChevronLeft } from 'lucide-react-native';

export default function OtpVerify() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [code, setCode] = useState(['', '', '', '']);

    // Custom numeric keypad logic
    const handleNumberPress = (num: string) => {
        const nextIndex = code.findIndex(digit => digit === '');
        if (nextIndex !== -1) {
            const newCode = [...code];
            newCode[nextIndex] = num;
            setCode(newCode);

            // Auto-submit if filled
            if (nextIndex === 3) {
                setTimeout(() => {
                    router.push('/create-username');
                }, 500);
            }
        }
    };

    const handleDelete = () => {
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
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={24} color="black" />
                    </TouchableOpacity>

                    {/* Segmented Progress Bar - Step 3/10 */}
                    <View className="flex-1 flex-row mx-4 gap-1">
                        <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                    </View>
                </View>

                <View className="items-center mb-12">
                    <Text className="text-black text-2xl font-bold mb-2">
                        Help us to verify your account
                    </Text>
                    <Text className="text-gray-500">
                        we've sent a code to {phone || '+91700454XX3X'}
                    </Text>
                </View>

                <View className="flex-row justify-center space-x-4 mb-12 gap-4">
                    {code.map((digit, index) => (
                        <View key={index} className={`w-16 h-16 rounded-full items-center justify-center ${digit ? 'bg-[#f9f9f9] border border-gray-300' : 'bg-gray-100'}`}>
                            <Text className={`text-2xl font-bold ${digit ? 'text-black' : 'text-gray-400'}`}>{digit}</Text>
                        </View>
                    ))}
                </View>

                {/* Custom Keypad */}
                <View className="bg-gray-50 rounded-t-3xl p-6 pb-12 mt-auto">
                    <View className="flex-row justify-between mb-4">
                        {[1, 2, 3].map(num => (
                            <TouchableOpacity key={num} onPress={() => handleNumberPress(num.toString())} className="flex-1 items-center py-4 bg-white m-1 rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-2xl font-medium text-black">{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row justify-between mb-4">
                        {[4, 5, 6].map(num => (
                            <TouchableOpacity key={num} onPress={() => handleNumberPress(num.toString())} className="flex-1 items-center py-4 bg-white m-1 rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-2xl font-medium text-black">{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row justify-between mb-4">
                        {[7, 8, 9].map(num => (
                            <TouchableOpacity key={num} onPress={() => handleNumberPress(num.toString())} className="flex-1 items-center py-4 bg-white m-1 rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-2xl font-medium text-black">{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="flex-1 m-1" />
                        <TouchableOpacity onPress={() => handleNumberPress('0')} className="flex-1 items-center py-4 bg-white m-1 rounded-xl shadow-sm border border-gray-100">
                            <Text className="text-2xl font-medium text-black">0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} className="flex-1 items-center justify-center m-1">
                            <Delete size={28} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
