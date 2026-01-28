import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeartIcon as HeartIconSolid } from 'react-native-heroicons/solid';
import { XMarkIcon } from 'react-native-heroicons/outline';
import AddIcon from '../icons/AddIcon';

const THUMBNAIL_WIDTH = 48;
const THUMBNAIL_HEIGHT = 56;
const SHARE_BUTTON_SIZE = 40;

interface ImageGalleryProps {
    imageContainerStyle: any;
    mainImage: string;
    cardHeight: number;
    collapsedPanelHeight: number;
    thumbnails: string[];
    onAddToCollection: () => void;
    likeIndicatorStyle: any;
    skipIndicatorStyle: any;
}

export default function ImageGallery({
    imageContainerStyle,
    mainImage,
    cardHeight,
    collapsedPanelHeight,
    thumbnails,
    onAddToCollection,
    likeIndicatorStyle,
    skipIndicatorStyle,
}: ImageGalleryProps) {
    return (
        <Animated.View
            className="bg-white relative"
            style={[imageContainerStyle, { borderRadius: 32, overflow: 'hidden' }]}
        >
            {/* Main Product Image */}
            <Image
                source={{ uri: mainImage }}
                style={{ width: '100%', height: cardHeight - collapsedPanelHeight }}
                resizeMode="cover"
            />

            {/* Thumbnails on Right */}
            <View style={{ position: 'absolute', right: 12, top: 16, gap: 8 }}>
                {thumbnails.map((uri, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            width: THUMBNAIL_WIDTH,
                            height: THUMBNAIL_HEIGHT,
                            borderRadius: 8,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            backgroundColor: 'white',
                        }}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Add to Collection Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
                activeOpacity={0.7}
                onPress={onAddToCollection}
            >
                <AddIcon size={SHARE_BUTTON_SIZE} />
            </TouchableOpacity>

            {/* Like Indicator */}
            <Animated.View
                style={[{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: '#22c55e',
                    borderRadius: 9999,
                    padding: 12,
                    zIndex: 10,
                }, likeIndicatorStyle]}
            >
                <HeartIconSolid size={24} color="#fff" />
            </Animated.View>

            {/* Skip Indicator */}
            <Animated.View
                style={[{
                    position: 'absolute',
                    top: 16,
                    left: 64,
                    backgroundColor: '#ef4444',
                    borderRadius: 9999,
                    padding: 12,
                    zIndex: 10,
                }, skipIndicatorStyle]}
            >
                <XMarkIcon size={24} color="#fff" strokeWidth={2} />
            </Animated.View>
        </Animated.View>
    );
}
