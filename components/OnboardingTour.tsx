import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, Platform, Image } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import RightSwipeIcon from '@/components/icons/swipes/rightswipe';
import LeftSwipeIcon from '@/components/icons/swipes/leftSwipe';
import UpSwipeIcon from '@/components/icons/swipes/upswipe';
import DownSwipeIcon from '@/components/icons/swipes/downswipe';

interface OnboardingTourProps {
    visible: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export default function OnboardingTour({ visible, onComplete, onSkip }: OnboardingTourProps) {
    const [step, setStep] = useState(0);

    if (!visible) return null;

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const steps = [
        {
            image: RightSwipeIcon,
            text: "Swipe Right to Like",
            actionLabel: "Next"
        },
        {
            image: LeftSwipeIcon,
            text: "Swipe Left to Dislike",
            actionLabel: "Next"
        },
        {
            image: UpSwipeIcon,
            text: "Swipe Up to View Details",
            actionLabel: "Next"
        },
        {
            image: DownSwipeIcon,
            text: "Swipe Down to Add to cart",
            actionLabel: "Start Swiping"
        }
    ];

    const currentStep = steps[step];
    const CurrentIcon = currentStep.image;

    return (
        <View className="absolute inset-0 z-50 bg-black/90 items-center justify-center">
            {/* Skip Button */}
            <SafeAreaView className="absolute top-0 right-0 p-4" style={{ zIndex: 10 }}>
                <TouchableOpacity
                    onPress={onSkip}
                    className="border border-white rounded-full px-5 py-2"
                    style={{ marginTop: Platform.OS === 'android' ? 40 : 0 }}
                >
                    <Text className="text-white font-bold text-sm">Skip</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Tour Content */}
            <View className="items-center justify-center flex-1">
                {/* Icon */}
                <View className="mb-8">
                    <CurrentIcon size={140} color="#FFFFFF" />
                </View>

                {/* Text */}
                <Text className="text-white text-2xl font-bold text-center mb-10 px-10">
                    {currentStep.text}
                </Text>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-black border border-white rounded-2xl px-12 py-4 shadow-lg shadow-white/20"
                >
                    <Text className="text-white text-lg font-bold">
                        {currentStep.actionLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
