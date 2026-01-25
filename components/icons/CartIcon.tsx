import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export default function CartIcon({ size = 24, color = 'black', strokeWidth = 1.5 }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M2.25 3H4.13543C4.55169 3 4.92211 3.26871 5.05697 3.66854L8.25 13.1361M8.25 13.1361C8.25 15.0007 9.77868 16.5122 11.6642 16.5122H18.9958C20.6698 16.5122 22.1065 15.3023 22.3887 13.653L23.25 8.61951H6.72666L8.25 13.1361ZM10.5 20.2561C10.5 20.6703 10.1642 21.0061 9.75 21.0061C9.33579 21.0061 9 20.6703 9 20.2561C9 19.8419 9.33579 19.5061 9.75 19.5061C10.1642 19.5061 10.5 19.8419 10.5 20.2561ZM21.75 20.2561C21.75 20.6703 21.4142 21.0061 21 21.0061C20.5858 21.0061 20.25 20.6703 20.25 20.2561C20.25 19.8419 20.5858 19.5061 21 19.5061C21.4142 19.5061 21.75 19.8419 21.75 20.2561Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
