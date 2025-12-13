import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';

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
        <View className="flex-1 bg-black px-6 pt-12">
            <TouchableOpacity
                onPress={() => router.back()}
                className="mb-8"
            >
                <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-3xl font-bold text-center mb-12">
                Your size and fit
            </Text>

            <View className="mb-12">
                <Text className="text-gray-400 text-center mb-6">Select a size</Text>
                <View className="flex-row flex-wrap justify-center gap-4">
                    {SIZES.map(size => (
                        <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            className={`w-14 h-14 rounded-full items-center justify-center border ${selectedSize === size ? 'bg-white border-white' : 'border-gray-600'
                                }`}
                        >
                            <Text className={`font-bold ${selectedSize === size ? 'text-black' : 'text-white'}`}>
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-8">
                <Text className="text-gray-400 text-center mb-6">Select a fit</Text>
                <View className="flex-row flex-wrap justify-center gap-4">
                    {FITS.map(fit => (
                        <TouchableOpacity
                            key={fit}
                            onPress={() => setSelectedFit(fit)}
                            className={`px-6 py-3 rounded-full border ${selectedFit === fit ? 'bg-[#eecfb4] border-[#eecfb4]' : 'border-gray-600'
                                }`}
                        >
                            <Text className={`font-bold ${selectedFit === fit ? 'text-black' : 'text-white'}`}>
                                {fit}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={handleContinue}
                disabled={!selectedSize || !selectedFit}
                className={`py-4 rounded-full mt-auto mb-10 ${selectedSize && selectedFit ? 'bg-[#eecfb4]' : 'bg-gray-800'
                    }`}
            >
                <Text className={`text-center font-bold text-lg ${selectedSize && selectedFit ? 'text-black' : 'text-gray-500'
                    }`}>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
    );
}
