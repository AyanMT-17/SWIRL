import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export default function HomeIcon({ size = 24, color = 'black', strokeWidth = 1.5 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
            <G clipPath="url(#clip0_658_2589)">
                <Path d="M15.97 24.7985C15.6538 22.601 15.4957 21.5022 15.9461 20.5628C16.3964 19.6233 17.3551 19.0523 19.2723 17.9102L20.4264 17.2227C22.1674 16.1856 23.038 15.667 23.9999 15.667C24.9618 15.667 25.8324 16.1856 27.5735 17.2227L28.7275 17.9102C30.6448 19.0523 31.6034 19.6233 32.0538 20.5628C32.5042 21.5022 32.3461 22.601 32.0299 24.7986L31.7975 26.413C31.3914 29.2359 31.1883 30.6473 30.2091 31.4905C29.2298 32.3337 27.7938 32.3337 24.9216 32.3337H23.0782C20.2061 32.3337 18.77 32.3337 17.7908 31.4905C16.8115 30.6473 16.6085 29.2359 16.2023 26.413L15.97 24.7985Z" stroke={color} strokeWidth={strokeWidth} />
                <Path d="M26.5 29H21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_658_2589">
                    <Rect width="20" height="20" fill="white" transform="translate(14 14)" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
