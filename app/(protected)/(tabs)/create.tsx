import { api } from '@/lib/api';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// import { useRouter } from 'expo-router'; // Uncomment for navigation

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export default function CreateTask() {
    // const router = useRouter(); 
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium' as TaskPriority | string,
    });

    const onChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateTask = async () => {
        if (!form.title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        setLoading(true);

        await api.post('/tasks', form)
            .then(response => {
                setForm({
                    title: '',
                    description: '',
                    priority: 'medium' as TaskPriority | string,
                })
            })
            .catch(error => {
                console.error("Failed to create task", error);
                alert("Failed to create task. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <ScrollView
                contentContainerClassName="px-6 py-8 flex-grow"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        New Task
                    </Text>
                    <Text className="text-gray-500 text-base mt-2">
                        What do you need to get done?
                    </Text>
                </View>

                {/* Form Sections */}
                <View className="gap-6">

                    {/* Title Input */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-gray-700 ml-1">Task Title</Text>
                        <TextInput
                            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900"
                            value={form.title}
                            onChangeText={(t) => onChange('title', t)}
                            placeholder="e.g., Buy groceries"
                            placeholderTextColor="#9ca3af"
                            editable={!loading}
                        />
                    </View>

                    {/* Description Input */}
                    <View className="gap-2">
                        <View className="flex-row justify-between items-end">
                            <Text className="text-sm font-semibold text-gray-700 ml-1">Description</Text>
                            <Text className="text-xs text-gray-400 mr-1">Optional</Text>
                        </View>
                        <TextInput
                            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900 min-h-[100px]"
                            value={form.description}
                            onChangeText={(t) => onChange('description', t)}
                            placeholder="Add any extra details here..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            textAlignVertical="top"
                            editable={!loading}
                        />
                    </View>

                    {/* Priority Input */}
                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-gray-700 ml-1">Priority</Text>
                        <TextInput
                            className="bg-white border border-gray-200 py-4 px-4 rounded-xl text-base text-gray-900"
                            value={form.priority}
                            onChangeText={(t) => onChange('priority', t)}
                            placeholder="e.g., low, medium, high, urgent"
                            placeholderTextColor="#9ca3af"
                            editable={!loading}
                            autoCapitalize="none"
                        />
                    </View>

                </View>

                {/* Submit Button */}
                <View className="mt-10 mb-4 flex-1 justify-end">
                    <TouchableOpacity
                        onPress={handleCreateTask}
                        disabled={loading}
                        className={`py-4 rounded-xl flex-row justify-center items-center shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'
                            }`}
                    >
                        {loading && (
                            <ActivityIndicator color="#ffffff" className="mr-2" size="small" />
                        )}
                        <Text className="text-center text-lg font-bold text-white">
                            {loading ? 'Saving...' : 'Save Task'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}