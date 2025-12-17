import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Data for the scattered images
const COLLAGE_IMAGES = [
    { id: 1, uri: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', style: { top: 40, left: 20, width: 100, height: 140, transform: [{ rotate: '-10deg' }] } },
    { id: 2, uri: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400', style: { top: 20, right: 30, width: 90, height: 120, transform: [{ rotate: '15deg' }] } },
    { id: 3, uri: 'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400', style: { top: 150, left: -20, width: 110, height: 150, transform: [{ rotate: '-5deg' }], zIndex: 1 } },
    { id: 4, uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', style: { top: 180, right: -10, width: 120, height: 160, transform: [{ rotate: '10deg' }] } },
    { id: 5, uri: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=400', style: { top: 100, left: width / 2 - 50, width: 100, height: 130, transform: [{ rotate: '0deg' }], zIndex: 2 } },
];

export default function GenderSelect() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedGender) {
            router.push('/dob-select');
        }
    };

    return (
        <View className="flex-1 bg-white px-6 pt-12 relative">
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 left-6 z-10"
            >
                <ArrowLeft size={24} color="black" />
            </TouchableOpacity>

            <View className="absolute top-14 left-0 right-0 items-center z-0 pointer-events-none">
                {/* Segmented Progress Bar - Step 7/10 */}
                <View className="flex-1 flex-row mx-4 gap-1 w-full px-12">
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                    <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                    <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                    <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                </View>
            </View>

            {/* Floating Image Cloud */}
            <View className="flex-1 relative mt-10 mb-8">
                {COLLAGE_IMAGES.map((img) => (
                    <View
                        key={img.id}
                        className="absolute rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg"
                        style={img.style}
                    >
                        <Image
                            source={{ uri: img.uri }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </View>

            <View className="mb-8 mt-auto">
                <Text className="text-black text-3xl font-bold text-center mb-4">
                    Select your Gender?
                </Text>
                <Text className="text-gray-500 text-center text-sm px-4 mb-8">
                    We'll show you brands and products that match your style and interests
                </Text>

                <View className="flex-row justify-between gap-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setSelectedGender('men')}
                        className={`flex-1 py-4 rounded-full flex-row items-center justify-center border ${selectedGender === 'men' ? 'bg-[#fdfde8] border-[#fdfde8]' : 'bg-[#f9f9f9] border-gray-200'
                            }`}
                    >
                        <Text className={`font-bold tracking-widest ${selectedGender === 'men' ? 'text-black' : 'text-gray-400'}`}>MALE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedGender('women')}
                        className={`flex-1 py-4 rounded-full flex-row items-center justify-center border ${selectedGender === 'women' ? 'bg-[#fdfde8] border-[#fdfde8]' : 'bg-[#f9f9f9] border-gray-200'
                            }`}
                    >
                        <Text className={`font-bold tracking-widest ${selectedGender === 'women' ? 'text-black' : 'text-gray-400'}`}>FEMALE</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={!selectedGender}
                    className={`py-4 rounded-full w-full ${selectedGender ? 'bg-[#eecfb4]' : 'bg-gray-200'}`}
                >
                    <Text className={`text-center font-bold text-lg ${selectedGender ? 'text-black' : 'text-gray-400'}`}>
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
