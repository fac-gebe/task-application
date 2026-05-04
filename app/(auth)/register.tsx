import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { api } from '../../lib/api'; // Adjust path as needed

// Reusable input component to keep the form clean
const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    optional = false,
    editable = true
}: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    optional?: boolean;
    editable?: boolean;
}) => (
    <View className="gap-2 mb-4">
        <View className="flex-row justify-between items-end">
            <Text className="text-sm font-semibold text-gray-700 ml-1">{label}</Text>
            {optional && <Text className="text-xs text-gray-400 mr-1">Optional</Text>}
        </View>
        <TextInput
            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={secureTextEntry || keyboardType === 'email-address' ? 'none' : 'words'}
            editable={editable}
        />
    </View>
);

export default function RegisterScreen() {
    // const router = useRouter(); // For navigating back to login
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: ''
    });

    const onChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        setLoading(true);

        // Clean up empty optional fields to be null for the backend
        const payload = {
            ...form,
            middle_name: form.middle_name.trim() === '' ? null : form.middle_name,
            phone: form.phone.trim() === '' ? null : form.phone,
            address: form.address.trim() === '' ? null : form.address,
        };

        await api.post('/register', payload)
            .then(response => {
                router.navigate('/login')
            })
            .catch(error => {
                console.error("Registration failed", error);
                alert("Registration failed. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <ScrollView
                contentContainerClassName="flex-grow justify-center px-6 py-10"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View className="mb-8 mt-4">
                    <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Create Account
                    </Text>
                    <Text className="text-gray-500 text-base mt-2">
                        Fill in your details to get started
                    </Text>
                </View>

                {/* Form Section */}
                <View>
                    {/* Personal Info Group */}
                    <Text className="text-lg font-bold text-gray-900 mb-4 mt-2">Personal Info</Text>
                    <FormInput
                        label="First Name"
                        value={form.first_name}
                        onChangeText={(t) => onChange('first_name', t)}
                        placeholder="John"
                        editable={!loading}
                    />
                    <FormInput
                        label="Middle Name"
                        value={form.middle_name}
                        onChangeText={(t) => onChange('middle_name', t)}
                        placeholder="Edward"
                        optional={true}
                        editable={!loading}
                    />
                    <FormInput
                        label="Last Name"
                        value={form.last_name}
                        onChangeText={(t) => onChange('last_name', t)}
                        placeholder="Doe"
                        editable={!loading}
                    />

                    {/* Divider */}
                    <View className="h-px bg-gray-200 my-4" />

                    {/* Contact Details Group */}
                    <Text className="text-lg font-bold text-gray-900 mb-4">Contact Details</Text>
                    <FormInput
                        label="Email Address"
                        value={form.email}
                        onChangeText={(t) => onChange('email', t)}
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        editable={!loading}
                    />
                    <FormInput
                        label="Phone Number"
                        value={form.phone}
                        onChangeText={(t) => onChange('phone', t)}
                        placeholder="09564456456"
                        keyboardType="phone-pad"
                        optional={true}
                        editable={!loading}
                    />
                    <FormInput
                        label="Address"
                        value={form.address}
                        onChangeText={(t) => onChange('address', t)}
                        placeholder="123 Main St, City, Country"
                        optional={true}
                        editable={!loading}
                    />

                    {/* Divider */}
                    <View className="h-px bg-gray-200 my-4" />

                    {/* Security Group */}
                    <Text className="text-lg font-bold text-gray-900 mb-4">Security</Text>
                    <FormInput
                        label="Password"
                        value={form.password}
                        onChangeText={(t) => onChange('password', t)}
                        placeholder="••••••••"
                        secureTextEntry={true}
                        editable={!loading}
                    />
                    <FormInput
                        label="Confirm Password"
                        value={form.password_confirmation}
                        onChangeText={(t) => onChange('password_confirmation', t)}
                        placeholder="••••••••"
                        secureTextEntry={true}
                        editable={!loading}
                    />
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    className={`mt-8 py-4 rounded-xl flex-row justify-center items-center shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'
                        }`}
                >
                    {loading && (
                        <ActivityIndicator color="#ffffff" className="mr-2" size="small" />
                    )}
                    <Text className="text-center text-lg font-bold text-white">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                </TouchableOpacity>

                {/* Login Redirect */}
                <TouchableOpacity
                    className="mt-6 flex-row justify-center items-center pb-6"
                    disabled={loading}
                    onPress={() => router.navigate('/login')}
                >
                    <Text className="text-gray-600 text-base">Already have an account? </Text>
                    <Text className="text-blue-600 font-bold text-base">Sign In</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}