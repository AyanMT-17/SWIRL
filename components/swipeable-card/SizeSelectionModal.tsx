import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface SizeSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    selectedSize: string;
    onSelectSize: (size: string) => void;
    onConfirm: () => void;
}

export default function SizeSelectionModal({
    visible,
    onClose,
    selectedSize,
    onSelectSize,
    onConfirm,
}: SizeSelectionModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'DMSans_700Bold', textAlign: 'center', marginBottom: 20 }}>Select Size</Text>
                    <View className="flex-row justify-center" style={{ gap: 12, marginBottom: 24 }}>
                        {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => onSelectSize(size)}
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    borderRadius: 9999,
                                    borderWidth: 1,
                                    backgroundColor: selectedSize === size ? 'black' : 'white',
                                    borderColor: selectedSize === size ? 'black' : '#d1d5db',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        fontFamily: 'DMSans_600SemiBold',
                                        color: selectedSize === size ? 'white' : '#374151',
                                    }}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row" style={{ gap: 12 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 16,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#d1d5db',
                                alignItems: 'center',
                            }}
                            onPress={onClose}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#374151' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 16,
                                borderRadius: 16,
                                backgroundColor: '#E8B298',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                onClose();
                                onConfirm();
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'DMSans_600SemiBold', color: '#111827' }}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
