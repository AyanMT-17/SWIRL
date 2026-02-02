import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { API } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function MyAccount() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [isAuthenticated]);

    const loadProfile = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        try {
            // 1. Fetch User Profile (Identity)
            const profileRes = await API.users.getProfile();
            const user = profileRes.data;
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');

            // 2. Fetch Preferences (Age)
            try {
                const ageRes = await API.preferences.get('profile_age');
                if (ageRes.data && ageRes.data.preferenceValue) {
                    setAge(String(ageRes.data.preferenceValue));
                }
            } catch (e) {
                // Age preference might not exist yet, generic error
                console.log('Age preference not set');
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Update Profile (Name)
            await API.users.updateProfile({ name });

            // 2. Update Preferences (Age)
            if (age) {
                await API.preferences.set('profile_age', age);
            }

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Failed to update profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#FDFCF7] justify-center items-center">
                <ActivityIndicator size="large" color="#E5B58D" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#FDFCF7]">
            {/* Header */}
            <View style={{ paddingTop: insets.top }} className="px-4 pb-4 bg-[#FDFCF7] z-10">
                <View className="flex-row items-center justify-between py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center -ml-2"
                    >
                        <ChevronLeftIcon size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-normal text-black flex-1 text-center pr-8">
                        My account
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-4"
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Inputs */}
                    <View className="space-y-4">
                        {/* Name Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                            />
                        </View>

                        {/* Age Input */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-white/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Age</Text>
                            <TextInput
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                className="text-lg font-normal text-black p-0"
                                placeholderTextColor="#A09F99"
                                placeholder="Enter your age"
                            />
                        </View>

                        {/* Email Input - Read Only */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-[#F0EFE9]/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Email</Text>
                            <TextInput
                                value={email}
                                editable={false}
                                className="text-lg font-normal text-[#666] p-0"
                            />
                        </View>

                        {/* Phone Input - Read Only */}
                        <View className="border border-[#E5E0D0] rounded-3xl px-5 py-3 bg-[#F0EFE9]/50">
                            <Text className="text-[#A09F99] text-sm font-normal mb-1">Phone Number</Text>
                            <TextInput
                                value={phone}
                                editable={false}
                                className="text-lg font-normal text-[#666] p-0"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View
                className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-8 bg-[#FDFCF7]"
                style={{ paddingBottom: insets.bottom + 16 }}
            >
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                    style={[
                        { width: '100%', backgroundColor: '#E5B58D', borderRadius: 9999, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
                        isSaving && { opacity: 0.7 }
                    ]}
                >
                    {isSaving ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-lg font-normal text-black">Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
