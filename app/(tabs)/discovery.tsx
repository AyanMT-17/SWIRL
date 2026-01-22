import { useRouter } from 'expo-router';
import { CameraIcon, ChevronLeftIcon, MicrophoneIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useState, useMemo } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PREMIUM_BRANDS, MOCK_PRODUCTS } from '@/constants/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

const CARD_WIDTH = Math.round(100 * widthScale);
const HEADER_BORDER_RADIUS = Math.round(32 * scale);
const FEED_BORDER_RADIUS = Math.round(32 * scale);

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
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Kashmir',
    image: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Maharashtra',
    image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Delhi',
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Mumbai',
    image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

const trendingFashionData: FashionCard[] = [
  {
    id: '1',
    name: 'Korean',
    image: 'https://images.pexels.com/photos/1549974/pexels-photo-1549974.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: '',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Old Money',
    image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

const lifestyleData: LifestyleCard[] = [
  {
    id: '1',
    name: 'Summer',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Work',
    image: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Vacation',
    image: 'https://images.pexels.com/photos/1042423/pexels-photo-1042423.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

const myBrandsData: BrandCard[] = [
  { id: '1', name: 'H&M', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png' },
  { id: '2', name: 'ZARA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png' },
  { id: '3', name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png' },
];

export default function Discovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top,
          width: SCREEN_WIDTH,
          height: Math.round(100 * heightScale) + insets.top,
          backgroundColor: '#FDFFF2',
          borderBottomLeftRadius: Math.round(24 * scale),
          borderBottomRightRadius: Math.round(24 * scale),
          justifyContent: 'center',
        }}
      >
        <View
          className="flex-row items-center mx-4 my-3 px-3"
          style={{
            backgroundColor: '#F7F8DB',
            borderRadius: Math.round(24 * scale),
            height: Math.round(44 * heightScale),
          }}
        >
          <TouchableOpacity className="mr-2" onPress={() => router.back()}>
            <ChevronLeftIcon size={20} color="#000" strokeWidth={2} />
          </TouchableOpacity>
          <MagnifyingGlassIcon size={16} color="#888" />
          <TextInput
            className="flex-1 ml-2 text-sm text-black"
            placeholder="Looking for something today?"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity className="ml-2">
            <CameraIcon size={18} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <MicrophoneIcon size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Feed Section */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFFF2',
          borderTopLeftRadius: FEED_BORDER_RADIUS,
          borderTopRightRadius: FEED_BORDER_RADIUS,
          borderBottomLeftRadius: FEED_BORDER_RADIUS,
          borderBottomRightRadius: FEED_BORDER_RADIUS,
          marginTop: 4,
          marginBottom: Math.round(94 * heightScale),
          overflow: 'hidden',
        }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        >
          {/* Near You Section */}
          <View className="px-4 mb-6">
            <Text className="text-black text-base font-bold mb-3">Near You</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {nearYouData.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="relative overflow-hidden"
                    style={{ width: CARD_WIDTH, borderRadius: 16 }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 left-0 right-0 items-center">
                      <Text className="text-white text-xs font-semibold text-center" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Trending Fashion Section */}
          <View className="px-4 mb-6">
            <Text className="text-black text-base font-bold mb-3">Trending Fashion</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {trendingFashionData.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="relative overflow-hidden"
                    style={{ width: CARD_WIDTH, borderRadius: 16 }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                    {item.name && (
                      <View className="absolute bottom-2 left-0 right-0 items-center">
                        <Text className="text-white text-xs font-semibold text-center" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Lifestyle Section */}
          <View className="px-4 mb-6">
            <Text className="text-black text-base font-bold mb-3">Lifestyle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {lifestyleData.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="relative overflow-hidden"
                    style={{ width: CARD_WIDTH, borderRadius: 16 }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 left-0 right-0 items-center">
                      <Text className="text-white text-xs font-semibold text-center" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* My Brands Section */}
          <View className="px-4 mb-6">
            <Text className="text-black text-base font-bold mb-3">My Brands</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {myBrandsData.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-white items-center justify-center"
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_WIDTH * 0.9,
                      borderRadius: 16,
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{ uri: item.logo }}
                      style={{ width: CARD_WIDTH * 0.7, height: CARD_WIDTH * 0.5 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
