import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home, Search, ShoppingCart, User } from 'lucide-react-native';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const currentRouteName = state.routes[state.index].name;

  if (currentRouteName === 'bag') {
    return null;
  }

  return (
    <View className="absolute bottom-6 left-4 right-4 h-20 bg-[#fdfde8] rounded-[30px] flex-row items-center justify-between px-6 shadow-xl shadow-black/30">
      {/* Left Side: Home & Search */}
      <View className="flex-row items-center gap-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('index')}
          className="items-center justify-center p-2"
        >
          <Home size={28} color={state.index === 0 ? "black" : "#666"} strokeWidth={2.5} />
          <Text className="text-[10px] font-medium mt-0.5 text-black">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('categories')}
          className="items-center justify-center p-2"
        >
          <Search size={28} color={state.index === 1 ? "black" : "#999"} strokeWidth={2.5} />
          <Text className="text-[10px] font-medium mt-0.5 text-[#999]">Discover</Text>
        </TouchableOpacity>
      </View>

      {/* Center: SWIRL. Text */}
      <View className="absolute left-0 right-0 items-center top-0 bottom-0 justify-center" pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => navigation.navigate('swirl')}
          className={`items-center justify-center px-4 py-2 rounded-full ${state.routeNames[state.index] === 'swirl' ? 'bg-[#ccfd51]' : 'bg-transparent'}`}
        >
          <Text className="text-xl font-black text-black tracking-widest">SWIRL.</Text>
        </TouchableOpacity>
      </View>

      {/* Right Side: Cart & Profile */}
      <View className="flex-row items-center gap-6">
        <TouchableOpacity
          onPress={() => navigation.navigate('bag')}
          className="items-center justify-center p-2"
        >
          <ShoppingCart size={28} color={state.index === 3 ? "black" : "#999"} strokeWidth={2.5} />
          <Text className="text-[10px] font-medium mt-0.5 text-[#999]">Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('account')}
          className="items-center justify-center p-2"
        >
          <User size={28} color={state.index === 4 ? "black" : "#999"} strokeWidth={2.5} />
          <Text className="text-[10px] font-medium mt-0.5 text-[#999]">Profile</Text>
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
      <Tabs.Screen name="index" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="swirl" />
      <Tabs.Screen name="bag" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
