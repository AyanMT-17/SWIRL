import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
}

export default function SearchIcon({ size = 24, color = 'black' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M23.5833 16.2915C19.5563 16.2915 16.2917 19.5561 16.2917 23.5832C16.2917 27.6102 19.5563 30.8748 23.5833 30.8748C27.6104 30.8748 30.875 27.6102 30.875 23.5832C30.875 19.5561 27.6104 16.2915 23.5833 16.2915ZM15.0417 23.5832C15.0417 18.8657 18.8659 15.0415 23.5833 15.0415C28.3008 15.0415 32.125 18.8657 32.125 23.5832C32.125 25.7169 31.3426 27.668 30.0491 29.165L32.7753 31.8912C33.0194 32.1353 33.0194 32.531 32.7753 32.7751C32.5312 33.0192 32.1355 33.0192 31.8914 32.7751L29.1652 30.0489C27.6681 31.3424 25.7171 32.1248 23.5833 32.1248C18.8659 32.1248 15.0417 28.3006 15.0417 23.5832Z" fill={color} />
        </Svg>
    );
}
