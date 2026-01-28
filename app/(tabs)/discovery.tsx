import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { SafeExpoSpeechRecognitionModule, useSafeSpeechRecognitionEvent } from "@/utils/SafeSpeechRecognition";
import DiscoveryHeader from '@/components/discovery/DiscoveryHeader';
import DiscoverySection from '@/components/discovery/DiscoverySection';
import {
  nearYouData,
  trendingFashionData,
  lifestyleData,
  myBrandsData
} from '@/components/discovery/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = 110;
const FEED_BORDER_RADIUS = 24;

export default function Discovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useSafeSpeechRecognitionEvent("start", () => setIsListening(true));
  useSafeSpeechRecognitionEvent("end", () => setIsListening(false));
  useSafeSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      setSearchQuery(event.results[0]?.transcript || "");
    }
  });
  useSafeSpeechRecognitionEvent("error", (error) => {
    console.log("Speech recognition error:", error);
    setIsListening(false);
  });


  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Photo Captured', 'Image search functionality would process this image.');
    }
  };

  const handleMic = async () => {
    if (isListening) {
      SafeExpoSpeechRecognitionModule.stop();
      return;
    }

    const { status } = await SafeExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Voice Search Unavailable",
        "Microphone access is required. If you are on Expo Go, this feature requires a Development Build."
      );
      return;
    }

    SafeExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
    });
  };

  const allFilteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    const places = nearYouData.filter(i => i.name.toLowerCase().includes(query)).map(i => ({ ...i, type: 'Place' }));
    const fashion = trendingFashionData.filter(i => i.name && i.name.toLowerCase().includes(query)).map(i => ({ ...i, type: 'Fashion' }));
    const lifestyle = lifestyleData.filter(i => i.name.toLowerCase().includes(query)).map(i => ({ ...i, type: 'Lifestyle' }));
    const brands = myBrandsData.filter(i => i.name.toLowerCase().includes(query)).map(i => ({ ...i, image: i.logo, type: 'Brand' }));

    return [...places, ...fashion, ...lifestyle, ...brands];
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="dark-content" />

      <DiscoveryHeader
        insets={insets}
        router={router}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isListening={isListening}
        handleCamera={handleCamera}
        handleMic={handleMic}
      />

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
          marginBottom: 94,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        >
          {searchQuery.trim().length > 0 ? (
            // Search Results View
            <View className="px-4">
              <Text className="text-black text-base font-bold mb-4">
                Search Results ({allFilteredItems.length})
              </Text>

              {allFilteredItems.length === 0 ? (
                <Text className="text-gray-500 text-center mt-10">No matches found.</Text>
              ) : (
                <View className="flex-row flex-wrap justify-between">
                  {allFilteredItems.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.type}-${item.id}-${index}`}
                      className="mb-4 bg-white rounded-2xl overflow-hidden"
                      style={{
                        width: (SCREEN_WIDTH - 48) / 2,
                        borderRadius: 16
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: '100%', aspectRatio: item.type === 'Brand' ? 1.5 : 0.8 }}
                        resizeMode={item.type === 'Brand' ? "contain" : "cover"}
                      />
                      <View className="p-2 bg-white">
                        <Text className="text-black font-semibold text-sm">{item.name}</Text>
                        <Text className="text-gray-400 text-xs">{item.type}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            // Default Discovery View
            <>
              <DiscoverySection
                title="Near You"
                data={nearYouData}
                cardWidth={CARD_WIDTH}
              />
              <DiscoverySection
                title="Trending Fashion"
                data={trendingFashionData}
                cardWidth={CARD_WIDTH}
              />
              <DiscoverySection
                title="Lifestyle"
                data={lifestyleData}
                cardWidth={CARD_WIDTH}
              />
              <DiscoverySection
                title="My Brands"
                data={myBrandsData}
                cardWidth={CARD_WIDTH}
                type="brand"
              />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
