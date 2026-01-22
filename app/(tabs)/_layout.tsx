import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { HomeIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from 'react-native-heroicons/outline';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Base design is iPhone 16: 393x852
const widthScale = SCREEN_WIDTH / 393;
const heightScale = SCREEN_HEIGHT / 852;
const scale = Math.min(widthScale, heightScale);

// Responsive footer dimensions (based on iPhone 16 specs)
const FOOTER_HEIGHT = Math.round(90 * heightScale);
const FOOTER_BORDER_RADIUS = Math.round(24 * scale);
const FOOTER_PADDING_HORIZONTAL = Math.round(32 * scale);
const ICON_SIZE = Math.round(24 * scale);
const BRAND_FONT_SIZE = Math.round(24 * scale);

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: FOOTER_HEIGHT,
      backgroundColor: '#DFE4C5',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: FOOTER_PADDING_HORIZONTAL,
      borderTopLeftRadius: FOOTER_BORDER_RADIUS,
      borderTopRightRadius: FOOTER_BORDER_RADIUS,
      // Shadow
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    }}>
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate('index')}
        style={{ alignItems: 'center', justifyContent: 'center', padding: 8 * scale }}
      >
        <HomeIcon size={ICON_SIZE} color={state.index === 0 ? "black" : "#666"} strokeWidth={state.index === 0 ? 2.5 : 2} />
      </TouchableOpacity>

      {/* Discovery/Search */}
      <TouchableOpacity
        onPress={() => navigation.navigate('discovery')}
        style={{ alignItems: 'center', justifyContent: 'center', padding: 8 * scale }}
      >
        <MagnifyingGlassIcon size={ICON_SIZE} color={state.index === 1 ? "black" : "#666"} strokeWidth={state.index === 1 ? 2.5 : 2} />
      </TouchableOpacity>

      {/* SWIRL Brand Text */}
      <TouchableOpacity
        onPress={() => navigation.navigate('swirl')}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          backgroundColor: state.index === 2 ? 'white' : 'transparent',
          borderRadius: 9999,
        }}
      >
        <Text style={{ fontSize: BRAND_FONT_SIZE, fontWeight: '900', fontFamily: 'DMSans_900Bold', color: 'black', letterSpacing: 1.5, lineHeight: 28 * scale }}>SWIRL.</Text>
      </TouchableOpacity>

      {/* Cart */}
      <TouchableOpacity
        onPress={() => navigation.navigate('cart')}
        style={{ alignItems: 'center', justifyContent: 'center', padding: 8 * scale }}
      >
        <ShoppingCartIcon size={ICON_SIZE} color={state.index === 3 ? "black" : "#666"} strokeWidth={state.index === 3 ? 2.5 : 2} />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        onPress={() => navigation.navigate('account')}
        style={{ alignItems: 'center', justifyContent: 'center', padding: 8 * scale }}
      >
        <UserIcon size={ICON_SIZE} color={state.index === 4 ? "black" : "#666"} strokeWidth={state.index === 4 ? 2.5 : 2} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <StatusBar style="dark" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discovery" />
      <Tabs.Screen name="swirl" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
