import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

export default function FriendsInvite() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/gender-select');
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1">
                <View className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-8 justify-between">
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={24} color="black" />
                        </TouchableOpacity>

                        {/* Segmented Progress Bar - Step 6/10 */}
                        <View className="flex-1 flex-row mx-4 gap-1">
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <Text className="text-black font-bold">Skip</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="items-center mb-8">
                        <Text className="text-black text-2xl font-bold mb-2">Friends on SWIRL.</Text>
                        <Text className="text-gray-500 text-center text-xs px-10">shop together with your friends and earn credit and extra offers on every order</Text>
                    </View>

                    <View className="bg-transparent py-4 border-b border-gray-200 mb-4 flex-row items-center justify-between">
                        {/* Section Header or Invite All? */}
                        <Text className="text-gray-400 font-bold uppercase text-xs">Invite</Text>
                    </View>

                    {/* Mock Friend List */}
                    <ScrollView>
                        <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-[#f9f9f9] border border-gray-200 rounded-full items-center justify-center">
                                    <Text className="font-bold text-black">S</Text>
                                </View>
                                <View>
                                    <Text className="text-black font-bold text-lg">Shreyas Singh</Text>
                                    <Text className="text-gray-500 text-xs">780056XX2X</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-[#f9f9f9] border border-gray-200 px-5 py-2 rounded-full">
                                <Text className="text-black text-xs font-bold">Invite</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-[#eecfb4] rounded-full items-center justify-center">
                                    <Text className="font-bold text-black">A</Text>
                                </View>
                                <View>
                                    <Text className="text-black font-bold text-lg">Ayan Khan</Text>
                                    <Text className="text-gray-500 text-xs">990011XX2X</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-[#f9f9f9] border border-gray-200 px-5 py-2 rounded-full">
                                <Text className="text-black text-xs font-bold">Invite</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-[#eecfb4] py-4 rounded-full mt-4 mb-4"
                    >
                        <Text className="text-black text-center font-bold text-lg">
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
