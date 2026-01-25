import { Alert } from "react-native";

let NativeModule: any = null;
let useNativeEvent: any = (name: string, cb: any) => { };

try {
    // Try to require the native module safely
    const mod = require("expo-speech-recognition");
    NativeModule = mod.ExpoSpeechRecognitionModule;
    useNativeEvent = mod.useSpeechRecognitionEvent;
} catch (e) {
    console.log("ExpoSpeechRecognition not found. This is expected in Expo Go.");
}

const isNativeModuleAvailable = !!NativeModule && typeof NativeModule.start === 'function';

export const SafeExpoSpeechRecognitionModule = {
    start: (options: any) => {
        if (isNativeModuleAvailable) {
            NativeModule.start(options);
        } else {
            Alert.alert(
                "Voice Search Unavailable",
                "Voice search requires a Development Build. It is not available in Expo Go. Please run npx expo run:android or npx expo run:ios."
            );
        }
    },
    stop: () => {
        if (isNativeModuleAvailable) {
            NativeModule.stop();
        }
    },
    requestPermissionsAsync: async () => {
        if (isNativeModuleAvailable) {
            return NativeModule.requestPermissionsAsync();
        }
        return { status: "denied", granted: false, canAskAgain: false, expires: "never" };
    },
};

export const useSafeSpeechRecognitionEvent = (eventName: string, callback: (event: any) => void) => {
    if (isNativeModuleAvailable) {
        try {
            useNativeEvent(eventName, callback);
        } catch (e) {
            // Ignore hook errors if module is weird
        }
    }
};
