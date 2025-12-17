import { View, Text, TouchableOpacity, TextInput, Platform, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DobSelect() {
    const router = useRouter();
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

    // Sync Text inputs when Date Picker changes
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);

        // Update text inputs
        setDay(currentDate.getDate().toString().padStart(2, '0'));
        setMonth((currentDate.getMonth() + 1).toString().padStart(2, '0'));
        setYear(currentDate.getFullYear().toString());
    };

    // Validate and Sync Date Picker when Text inputs change
    useEffect(() => {
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);

        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
            // Basic range checks
            const currentYear = new Date().getFullYear();
            if (y > 1900 && y <= currentYear && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
                // Precise date validity check (e.g. Feb 29, April 31)
                const newDate = new Date(y, m - 1, d);
                if (newDate.getFullYear() === y && newDate.getMonth() === m - 1 && newDate.getDate() === d) {
                    setDate(newDate);
                }
            }
        }
    }, [day, month, year]);

    // Validation for "Continue" button
    const isDateValid = () => {
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);

        if (isNaN(d) || isNaN(m) || isNaN(y)) return false;

        const currentYear = new Date().getFullYear();
        if (y < 1920 || y > currentYear) return false;
        if (m < 1 || m > 12) return false;

        const testDate = new Date(y, m - 1, d);
        return testDate.getFullYear() === y && testDate.getMonth() === m - 1 && testDate.getDate() === d;
    };


    const handleContinue = () => {
        if (isDateValid()) {
            router.push('/feed-select');
        }
    };

    const handleDayChange = (text: string) => {
        if (text.length <= 2) setDay(text);
        if (text.length === 2) Keyboard.dismiss(); // Optional UX
    };

    const handleMonthChange = (text: string) => {
        if (text.length <= 2) setMonth(text);
        if (text.length === 2) Keyboard.dismiss();
    };

    const handleYearChange = (text: string) => {
        if (text.length <= 4) setYear(text);
        if (text.length === 4) Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 px-6 pt-12 pb-10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mb-8"
                    >
                        <ArrowLeft size={24} color="black" />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        {/* Segmented Progress Bar - Step 8/10 */}
                        <View className="flex-1 flex-row gap-1 w-full">
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-[#ccfd51] rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                            <View className="h-1 flex-1 bg-gray-200 rounded-full" />
                        </View>
                    </View>

                    <Text className="text-black text-3xl font-bold text-center mb-12">
                        What's your age?
                    </Text>

                    {/* Text Inputs (Hidden or styled better if keeping manual entry) */}
                    {/* Keeping manual entry for robustness but simplifying UI to be minimally invasive if user prefers picker */}
                    <View className="flex-row justify-center space-x-4 mb-8 opacity-50">
                        <View className="items-center">
                            <Text className="text-gray-500 mb-2">Year</Text>
                            <TextInput
                                className="bg-transparent text-black text-xl font-bold border-b border-gray-300 w-20 text-center py-2"
                                placeholder="YYYY"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={4}
                                value={year}
                                onChangeText={handleYearChange}
                                returnKeyType="done"
                            />
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-500 mb-2">Month</Text>
                            <TextInput
                                className="bg-transparent text-black text-xl font-bold border-b border-gray-300 w-12 text-center py-2"
                                placeholder="MM"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={2}
                                value={month}
                                onChangeText={handleMonthChange}
                                returnKeyType="done"
                            />
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-500 mb-2">Day</Text>
                            <TextInput
                                className="bg-transparent text-black text-xl font-bold border-b border-gray-300 w-12 text-center py-2"
                                placeholder="DD"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={2}
                                value={day}
                                onChangeText={handleDayChange}
                                returnKeyType="done"
                            />
                        </View>
                    </View>

                    {/* Scrollable Picker */}
                    <View className="items-center justify-center mt-4 mb-20">
                        {Platform.OS === 'android' && (
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                className="bg-gray-100 px-6 py-3 rounded-full mb-4"
                            >
                                <Text className="text-black">Select from Calendar</Text>
                            </TouchableOpacity>
                        )}

                        {(showPicker || Platform.OS === 'ios') && (
                            <View className="bg-gray-50 rounded-2xl p-2 w-full max-w-xs overflow-hidden">
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    display="spinner"
                                    onChange={onDateChange}
                                    textColor="black"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1920, 0, 1)}
                                    themeVariant="light"
                                    style={{ height: 150 }}
                                />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!isDateValid()}
                        className={`py-4 rounded-full mt-auto ${isDateValid() ? 'bg-[#eecfb4]' : 'bg-gray-200'
                            }`}
                    >
                        <Text className={`text-center font-bold text-lg ${isDateValid() ? 'text-black' : 'text-gray-400'
                            }`}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
