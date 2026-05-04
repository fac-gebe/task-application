import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type UserData = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    phone: string | null;
    address: string | null;
    status: string;
    last_login_at: string;
}

// A reusable sub-component for displaying data rows cleanly
const InfoRow = ({ label, value, isLast = false }: { label: string; value: string | null | undefined; isLast?: boolean }) => (
    <View className={`flex-row justify-between py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
        <Text className="text-gray-500 font-medium">{label}</Text>
        <Text className="text-gray-900 text-right flex-1 ml-4" numberOfLines={2}>
            {value || 'Not provided'}
        </Text>
    </View>
);

// A reusable sub-component for the skeleton rows
const SkeletonRow = ({ isLast = false }: { isLast?: boolean }) => (
    <View className={`flex-row justify-between py-4 items-center ${!isLast ? 'border-b border-gray-100' : ''}`}>
        {/* Label Placeholder */}
        <View className="h-4 w-24 bg-gray-200 rounded " />
        {/* Value Placeholder */}
        <View className="h-4 w-32 bg-gray-200 rounded " />
    </View>
);

export const ProfileSkeleton = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <View className="pb-6">
                {/* Header Section Skeleton */}
                <View className="items-center pt-10 pb-6 px-4">
                    {/* Avatar */}
                    <View className="w-24 h-24 rounded-full bg-gray-200  mb-4" />
                    {/* Name */}
                    <View className="h-8 w-48 bg-gray-200 rounded  mb-2" />
                    {/* Email */}
                    <View className="h-4 w-40 bg-gray-200 rounded  mt-1" />
                    {/* Status Badge */}
                    <View className="mt-3 h-6 w-16 rounded-full bg-gray-200 " />
                </View>

                {/* Details Card Skeleton */}
                <View className="bg-white rounded-2xl mx-4 px-4 shadow-sm border border-gray-100 mb-6">
                    {/* Card Title */}
                    <View className="h-6 w-36 bg-gray-200 rounded  mt-4 mb-2" />
                    {/* 3 Detail Rows */}
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow isLast={true} />
                </View>
            </View>

            {/* Pinned Logout Button Skeleton */}
            <View className="px-4 pb-8 pt-2 bg-gray-50 flex-1 justify-end">
                <View className="bg-gray-200 h-14 rounded-xl  w-full" />
            </View>
        </View>
    );
};

export default function Profile() {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);

    const getUserData = async () => {
        api.get('/user')
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch user data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useFocusEffect(
        useCallback(() => {
            getUserData();
        }, [])
    );

    if (loading) return <ProfileSkeleton />

    // Extract initials for the avatar (e.g., "John Doe" -> "JD")
    const initials = `${userData?.first_name?.[0] || ''}${userData?.last_name?.[0] || ''}`.toUpperCase();

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView contentContainerClassName="pb-6">
                {/* Header Section */}
                <View className="items-center pt-10 pb-6 px-4">
                    <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-4">
                        <Text className="text-3xl font-bold text-blue-600 tracking-wider">
                            {initials}
                        </Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 text-center">
                        {userData?.first_name} {userData?.middle_name ? `${userData.middle_name} ` : ''}{userData?.last_name}
                    </Text>
                    <Text className="text-base text-gray-500 mt-1">
                        {userData?.email}
                    </Text>

                    {/* Status Badge */}
                    <View className="mt-3 px-3 py-1 rounded-full bg-green-100">
                        <Text className="text-green-700 text-xs font-bold uppercase tracking-wider">
                            {userData?.status || 'Active'}
                        </Text>
                    </View>
                </View>

                {/* Details Card */}
                <View className="bg-white rounded-2xl mx-4 px-4 shadow-sm border border-gray-100 mb-6">
                    <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">Personal Details</Text>
                    <InfoRow label="Phone Number" value={userData?.phone} />
                    <InfoRow label="Address" value={userData?.address} />
                    <InfoRow
                        label="Last Login"
                        value={userData?.last_login_at ? new Date(userData.last_login_at).toLocaleDateString() : 'N/A'}
                        isLast={true}
                    />
                </View>
            </ScrollView>

            {/* Pinned Logout Button */}
            <View className="px-4 pb-8 pt-2 bg-gray-50">
                <TouchableOpacity
                    className="bg-red-50 py-4 rounded-xl border border-red-100 items-center"
                    onPress={signOut}
                >
                    <Text className="text-red-600 font-semibold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}