import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
const FITS = ['BAGGY', 'SLIM', 'CASUAL', 'RETRO'];

export default function SizeSelect() {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedFit, setSelectedFit] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedSize && selectedFit) {
            router.replace('/(tabs)');
        }
    };

    return (
        <View className="flex-1 bg-white px-6 pt-12">
            <View className="flex-row items-center mb-8">
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={24} color="black" />
                </TouchableOpacity>

                {/* Segmented Progress Bar - Step 10/10 (Full) */}
                <View className="flex-1 flex-row mx-4 gap-1">
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                </View>
            </View>

            <Text className="text-black text-3xl font-bold text-center mb-12">
                Your Fit
            </Text>

            <View className="mb-12">
                <View className="flex-row flex-wrap justify-center gap-4">
                    {SIZES.map(size => (
                        <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            className={`w-14 h-14 rounded-full items-center justify-center border ${selectedSize === size ? 'bg-[#fdfde8] border-[#fdfde8]' : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text className={`font-bold ${selectedSize === size ? 'text-black' : 'text-black'}`}>
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-8">
                <View className="flex-row flex-wrap justify-center gap-4">
                    {FITS.map(fit => (
                        <TouchableOpacity
                            key={fit}
                            onPress={() => setSelectedFit(fit)}
                            className={`px-8 py-4 rounded-2xl border ${selectedFit === fit ? 'bg-[#fdfde8] border-[#fdfde8]' : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text className={`font-bold tracking-widest uppercase ${selectedFit === fit ? 'text-black' : 'text-black'}`}>
                                {fit}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={handleContinue}
                disabled={!selectedSize || !selectedFit}
                className={`py-4 rounded-full mt-auto mb-10 ${selectedSize && selectedFit ? 'bg-[#eecfb4]' : 'bg-gray-200'
                    }`}
            >
                <Text className={`text-center font-bold text-lg ${selectedSize && selectedFit ? 'text-black' : 'text-gray-400'
                    }`}>
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    );
}
