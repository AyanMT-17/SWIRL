import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import CartIcon from '@/components/icons/CartIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Fixed footer dimensions
const FOOTER_HEIGHT = 90;
const FOOTER_BORDER_RADIUS = 24;
const FOOTER_PADDING_HORIZONTAL = 32;
// Increased size for custom SVGs as per user request
const ICON_SIZE = 45;
const CART_ICON_SIZE = 20;
const BRAND_FONT_SIZE = 24;

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: FOOTER_HEIGHT,
      backgroundColor: '#E1E2C3',
      flexDirection: 'row',
      alignItems: 'center',
      borderTopLeftRadius: FOOTER_BORDER_RADIUS,
      borderTopRightRadius: FOOTER_BORDER_RADIUS,
      paddingHorizontal: 24,
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('index')}
          style={{ padding: 8 }}
        >
          <HomeIcon size={ICON_SIZE} color={state.index === 0 ? "black" : "#666"} strokeWidth={state.index === 0 ? 2.5 : 2} />
        </TouchableOpacity>
      </View>

      {/* Discovery/Search */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('discovery')}
          style={{ padding: 8 }}
        >
          <SearchIcon size={ICON_SIZE} color={state.index === 1 ? "black" : "#666"} />
        </TouchableOpacity>
      </View>

      {/* SWIRL Brand Text */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('swirl')}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: state.index === 2 ? 'white' : 'transparent',
            borderRadius: 16,
          }}
        >
          <Text style={{
            fontSize: 24,
            fontFamily: 'DMSans_700Bold',
            color: state.index === 2 ? 'black' : 'black',
            letterSpacing: 0,
            lineHeight: 24,
          }}>SWIRL.</Text>
        </TouchableOpacity>
      </View>

      {/* Cart */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('cart')}
          style={{ padding: 8 }}
        >
          <CartIcon size={CART_ICON_SIZE} color={state.index === 3 ? "black" : "#666"} strokeWidth={state.index === 3 ? 2.5 : 2} />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('account')}
          style={{ padding: 8 }}
        >
          <ProfileIcon size={ICON_SIZE} color={state.index === 4 ? "black" : "#666"} />
        </TouchableOpacity>
      </View>
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
