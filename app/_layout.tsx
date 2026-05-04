import "@/global.css";
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // 👈 ADD THIS
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';


import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
    const { token, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inProtectedGroup = segments[0] === '(protected)';

        if (!token && inProtectedGroup) {
            router.replace('/(auth)/login');
        } else if (token && !inProtectedGroup) {
            router.replace('/(protected)/(tabs)');
        }

    }, [token, isLoading, segments, router]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Nag Loading...</Text>
            </View>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="auto" /> {/* 👈 THIS FIXES IT */}
            <RootLayoutNav />
        </AuthProvider>
    );
}