import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';

interface SwipeHandIconProps {
    size?: number;
    color?: string;
    direction?: 'right' | 'left' | 'up' | 'down';
}

export default function SwipeHandIcon({ size = 24, color = 'white', direction = 'right' }: SwipeHandIconProps) {
    let rotation = 0;
    let scaleX = 1;

    switch (direction) {
        case 'right':
            rotation = 0;
            break;
        case 'left':
            scaleX = -1; // Mirror horizontally
            break;
        case 'up':
            rotation = -90;
            break;
        case 'down':
            rotation = 90;
            break;
    }

    return (
        <View style={{ transform: [{ rotate: `${rotation}deg` }, { scaleX }] }}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                {/* Hand Icon (Finger pointing/touching) - stylized to match HeroIcons */}
                <Path d="M15.5 10.5L15.5 13.5C15.5 15.1569 14.1569 16.5 12.5 16.5C10.8431 16.5 9.5 15.1569 9.5 13.5V6.5C9.5 5.39543 8.60457 4.5 7.5 4.5C6.39543 4.5 5.5 5.39543 5.5 6.5V15.5C5.5 18.2614 7.73858 20.5 10.5 20.5H12.5C14.8569 20.5 17.5 19.5 18.5 16.5L19.5 10.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M15.5 10.5H16.5C17.6046 10.5 18.5 9.60457 18.5 8.5C18.5 7.39543 17.6046 6.5 16.5 6.5H15.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Curved Arrow (Swipe Arc) */}
                <Path d="M12 3C16 3 20 6 21 10" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M21 10L17 10" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M21 10L21 6" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        </View>
    );
}
