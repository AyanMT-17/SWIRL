import { useRouter } from 'expo-router';
import { Camera, ChevronLeft, Mic, Search } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    name: 'Streetwear – Delhi',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Ethnic Wear – Jaipur',
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Saree Style – Kolkata',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Casual Fashion – Mumbai',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Traditional Bridal – North India',
    image: 'https://images.unsplash.com/photo-1545243424-0ce743321e11?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Kurta Look – Lucknow',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Fusion Wear – Bangalore',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    name: 'Street Style – Hyderabad',
    image: 'https://images.unsplash.com/photo-1523205565295-f8e91625443f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    name: 'Festive Wear – Gujarat',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    name: 'Office Casual – Pune',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '11',
    name: 'Modern Saree – Chennai',
    image: 'https://images.unsplash.com/photo-1516685304081-de7947d419d1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '12',
    name: 'Ethnic Menswear – Punjab',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '13',
    name: 'Boho Style – Goa',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '14',
    name: 'Minimal Street – Urban',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '15',
    name: 'Winter Fashion – North India',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
  }
];



const trendingFashionData: FashionCard[] = [
  {
    id: '1',
    name: 'Ocean',
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Red',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Old Money',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    name: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '5',
    name: 'Minimal Beige',
    image: 'https://images.unsplash.com/photo-1516642499105-492ff3ac521b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '6',
    name: 'Denim Classic',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '7',
    name: 'Boho Summer',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '8',
    name: 'Black Suit',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '9',
    name: 'Urban Hoodie',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '10',
    name: 'Saree Glam',
    image: 'https://images.unsplash.com/photo-1516685304081-de7947d419d1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '11',
    name: 'Festive Ethnic',
    image: 'https://images.unsplash.com/photo-1545243424-0ce743321e11?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '12',
    name: 'Street Shopper',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '13',
    name: 'Vintage Coat',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '14',
    name: 'Pastel Casual',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '15',
    name: 'Monochrome Fit',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '16',
    name: 'Beachwear',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '17',
    name: 'Winter Layers',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '18',
    name: 'Sporty Fit',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '19',
    name: 'Party Night',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '20',
    name: 'Classic White Shirt',
    image: 'https://images.unsplash.com/photo-1516642499105-492ff3ac521b?auto=format&fit=crop&w=400&q=80'
  }
];


const lifestyleData: LifestyleCard[] = [
  {
    id: '1',
    name: 'Summer',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Work',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    name: 'Coffee Break',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '5',
    name: 'City Walk',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '6',
    name: 'Reading Time',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '7',
    name: 'Gym',
    image: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '8',
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '9',
    name: 'Night Out',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '10',
    name: 'Beach Day',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '11',
    name: 'Casual Street',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '12',
    name: 'Morning Run',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '13',
    name: 'Studio Work',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '14',
    name: 'Home Office',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '15',
    name: 'Weekend Chill',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80'
  }
];

const myBrandsData: BrandCard[] = [
  {
    id: '1',
    name: 'H&M',
    logo: 'https://1000logos.net/wp-content/uploads/2017/02/HM-Logo-640x400.png',
  },
  {
    id: '2',
    name: 'ZARA',
    logo: 'https://1000logos.net/wp-content/uploads/2022/08/Zara-log%D0%BE-768x432.png',
  },
  {
    id: '3',
    name: 'Adidas',
    logo: 'https://1000logos.net/wp-content/uploads/2016/10/Adidas-Logo-768x432.png',
  },
  {
    id: '4',
    name: 'Puma',
    logo: 'https://1000logos.net/wp-content/uploads/2021/04/Puma-logo-666x333.png'
  },
  {
    id: '5',
    name: 'Louis Vuitton',
    logo: 'https://1000logos.net/wp-content/uploads/2021/04/Louis-Vuitton-logo-768x432.png'
  },
  {
    id: '6',
    name: 'Balenciaga',
    logo: 'https://1000logos.net/wp-content/uploads/2020/07/Balenciaga-logo-640x427.png'
  },
  {
    id: '7',
    name: 'Burberry',
    logo: 'https://1000logos.net/wp-content/uploads/2016/10/Burberry-Logo-768x432.png'
  },
  {
    id: '8',
    name: 'Calvin Klein',
    logo: 'https://1000logos.net/wp-content/uploads/2021/11/Calvin-Klein-logo-768x432.png'
  }
];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f5f5f0] pb-20">
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
                    resizeMode="contain"
                    source={{ uri: item.logo }}
                    className="w-full h-full"
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
