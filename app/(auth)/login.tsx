import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const onChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            alert("Please fill in both fields.");
            return;
        }

        setLoading(true);
        await api.post('/login', form)
            .then(response => {
                const { token } = response.data;
                signIn(token);
            })
            .catch(error => {
                console.error("Login failed", error);
                alert("Login failed. Please check your credentials.");
            })
            .finally(() => setLoading(false));
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <View className="flex-1 justify-center px-6">

                {/* Header Section */}
                <View className="mb-10">
                    <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome Back!
                    </Text>
                </View>

                {/* Form Section */}
                <View className="gap-5">
                    {/* Email Input */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-gray-700 ml-1">Email Address</Text>
                        <TextInput
                            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900"
                            value={form.email}
                            onChangeText={(text) => onChange('email', text)}
                            placeholder="name@example.com"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-gray-700 ml-1">Password</Text>
                        <TextInput
                            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900"
                            value={form.password}
                            onChangeText={(text) => onChange('password', text)}
                            placeholder="••••••••"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            editable={!loading}
                        />
                    </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className={`mt-8 py-4 rounded-xl flex-row justify-center items-center shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                >
                    {loading && (
                        <ActivityIndicator color="#ffffff" className="mr-2" size="small" />
                    )}
                    <Text className="text-center text-lg font-bold text-white">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center mt-8" disabled={loading} onPress={() => router.navigate('/register')}>
                    <Text className="text-blue-600 font-medium text-sm">
                        Register?
                    </Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
}