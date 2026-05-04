import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
            {/* ✅ Only THIS is a tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create Task',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add" size={size} color={color} />
                    ),
                }}
            />

            {/* ✅ Profile tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />

            {/* ❌ Hide nested routes */}
            <Tabs.Screen name="tasks/index" options={{ href: null }} />
            <Tabs.Screen name="tasks/[id]" options={{ href: null }} />
        </Tabs>
    );
}