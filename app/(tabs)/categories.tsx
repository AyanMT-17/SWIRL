import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Camera, Mic, ChevronLeft } from 'lucide-react-native';

interface LocationCard {
  id: string;
  name: string;
  image: string;
}

interface FashionCard {
  id: string;
  name: string;
  image: string;
}

interface LifestyleCard {
  id: string;
  name: string;
  image: string;
}

interface BrandCard {
  id: string;
  name: string;
  logo: string;
}

const nearYouData: LocationCard[] = [
  {
    id: '1',
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1523509233592-c5a9a0e3e0c6?w=400',
  },
  {
    id: '2',
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  },
  {
    id: '3',
    name: 'Marathi',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  },
];

const trendingFashionData: FashionCard[] = [
  {
    id: '1',
    name: 'Ocean',
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400',
  },
  {
    id: '2',
    name: 'Red',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
  },
  {
    id: '3',
    name: 'Old Money',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400',
  },
];

const lifestyleData: LifestyleCard[] = [
  {
    id: '1',
    name: 'Summer',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
  },
  {
    id: '2',
    name: 'Work',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: '3',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  },
];

const myBrandsData: BrandCard[] = [
  {
    id: '1',
    name: 'H&M',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/200px-H%26M-Logo.svg.png',
  },
  {
    id: '2',
    name: 'ZARA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/200px-Zara_Logo.svg.png',
  },
  {
    id: '3',
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png',
  },
];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f5f5f0]">
      <StatusBar barStyle="dark-content" />

      {/* Header with Search */}
      <View className="bg-[#f5f1e8] rounded-3xl pt-4 pb-4 px-5 mx-2 mt-12">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3">
            <ChevronLeft size={20} color="#000" />
          </TouchableOpacity>
          <Search size={18} color="#666" />
          <TextInput
            className="flex-1 ml-3 text-base text-black"
            placeholder="Looking for something today?"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity className="ml-2">
            <Camera size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-3">
            <Mic size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Near You Section */}
        <View className="bg-white rounded-3xl mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-bold mb-3">Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {nearYouData.map((item) => (
                <TouchableOpacity key={item.id} className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-24 h-32 rounded-2xl"
                  />
                  <View className="absolute bottom-2 left-2">
                    <Text className="text-white text-sm font-semibold shadow-lg">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Fashion Section */}
        <View className="mt-4 px-4">
          <Text className="text-black text-lg font-bold mb-3">
            Trending Fashion
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {trendingFashionData.map((item) => (
                <TouchableOpacity key={item.id} className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-24 h-32 rounded-2xl"
                  />
                  <View className="absolute bottom-2 left-2">
                    <Text className="text-white text-sm font-semibold shadow-lg">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Lifestyle Section */}
        <View className="mt-4 px-4">
          <Text className="text-black text-lg font-bold mb-3">Lifestyle</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {lifestyleData.map((item) => (
                <TouchableOpacity key={item.id} className="relative">
                  <Image
                    source={{ uri: item.image }}
                    className="w-24 h-32 rounded-2xl"
                  />
                  <View className="absolute bottom-2 left-2">
                    <Text className="text-white text-sm font-semibold shadow-lg">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* My Brands Section */}
        <View className="mt-4 px-4 pb-6">
          <Text className="text-black text-lg font-bold mb-3">My Brands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {myBrandsData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="w-24 h-32 bg-white rounded-2xl items-center justify-center border border-gray-100"
                >
                  <Image
                    source={{ uri: item.logo }}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
