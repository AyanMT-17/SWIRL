import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

const INTERESTS = [
    { id: '1', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '3', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '4', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '5', image: 'https://images.pexels.com/photos/6064683/pexels-photo-6064683.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '6', image: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function FeedSelect() {
    const router = useRouter();
    const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleContinue = () => {
        if (selectedInterests.size > 0) {
            router.push('/size-select');
        }
    };

    return (
        <View className="flex-1 bg-black px-4 pt-12">
            <TouchableOpacity
                onPress={() => router.back()}
                className="mb-8 pl-2"
            >
                <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-3xl font-bold text-center mb-2">
                Create Your feed
            </Text>
            <Text className="text-gray-400 text-center mb-8">
                Select at least 1
            </Text>

            <FlatList
                data={INTERESTS}
                numColumns={2}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => toggleInterest(item.id)}
                        className="w-[48%] aspect-[3/4] mb-4 relative rounded-xl overflow-hidden"
                    >
                        <Image
                            source={{ uri: item.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        {selectedInterests.has(item.id) && (
                            <View className="absolute inset-0 bg-black/40 items-center justify-center border-4 border-[#eecfb4] rounded-xl">
                                <CheckCircle size={40} color="#eecfb4" fill="black" />
                            </View>
                        )}
                        {!selectedInterests.has(item.id) && (
                            <View className="absolute top-2 right-2">
                                <View className="w-6 h-6 rounded-full border-2 border-white/50" />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                onPress={handleContinue}
                disabled={selectedInterests.size === 0}
                className={`py-4 rounded-full mt-4 mb-4 ${selectedInterests.size > 0 ? 'bg-[#eecfb4]' : 'bg-gray-800'
                    }`}
            >
                <Text className={`text-center font-bold text-lg ${selectedInterests.size > 0 ? 'text-black' : 'text-gray-500'
                    }`}>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
    );
}
