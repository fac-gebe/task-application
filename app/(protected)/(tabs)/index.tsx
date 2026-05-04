import { api } from '@/lib/api';
import { router, useFocusEffect } from 'expo-router';
// import { useRouter } from 'expo-router'; // Uncomment when ready to route
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

type TasksData = {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
}

// Helper to color-code status badges
const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
        case 'completed': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' };
        case 'in_progress': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' };
    }
};

// Helper to color-code priority badges
const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
        case 'urgent': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' };
        case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' };
        case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' };
        default: return { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Low' };
    }
};

export default function Tasks() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<TasksData[]>([]);

    const getTasks = async () => {
        setLoading(true);
        api.get('/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch tasks:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useFocusEffect(
        useCallback(() => {
            getTasks();
        }, [])
    );

    const handleEditTask = (task: TasksData) => {
        router.push(`/task/${task.id}`);
    };

    const handleDeleteTask = async (id: number) => {
        try {
            const response = await api.delete(`/tasks/${id}`)
            if (response.status === 200) {
                getTasks()
            }
        } catch (error) {
            console.log('Error deleting', error)
        }

        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        api.delete(`/tasks/${id}`)
                            .then(() => {
                                setTasks(prev => prev.filter(task => task.id !== id));
                            })
                            .catch(error => {
                                console.error("Failed to delete task:", error);
                                alert("Failed to delete task. Please try again.");
                            });
                    }
                }
            ]
        );
    };

    // Render individual task card
    const renderTask = ({ item }: { item: TasksData }) => {
        const statusBadge = getStatusBadge(item.status);
        const priorityBadge = getPriorityBadge(item.priority);

        return (
            <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-gray-900 flex-1 pr-2" numberOfLines={1}>
                        {item.title}
                    </Text>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => handleEditTask(item)}
                            className="bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                            <Text className="text-blue-600 font-semibold text-xs">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDeleteTask(item.id)}
                            className="bg-red-50 px-3 py-1.5 rounded-lg"
                        >
                            <Text className="text-red-600 font-semibold text-xs">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {item.description ? (
                    <Text className="text-gray-500 mb-4 text-sm" numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}

                {/* Badges Row */}
                <View className="flex-row gap-2 mt-auto">
                    <View className={`px-2.5 py-1 rounded-md ${statusBadge.bg}`}>
                        <Text className={`text-xs font-bold ${statusBadge.text}`}>
                            {statusBadge.label}
                        </Text>
                    </View>
                    <View className={`px-2.5 py-1 rounded-md ${priorityBadge.bg}`}>
                        <Text className={`text-xs font-bold ${priorityBadge.text}`}>
                            {priorityBadge.label}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // Component for when the list is completely empty
    const EmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl">📝</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">No tasks yet</Text>
        </View>
    );

    if (loading && tasks.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-500 font-medium">Loading tasks...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header with Title and Add Button */}
            <View className="flex-row justify-between items-center px-6 pt-5 pb-4">
                <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    My Tasks
                </Text>
            </View>

            {/* Task List */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTask}
                contentContainerClassName="px-6 pb-6 pt-2 flex-grow"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState />}
                refreshing={loading}
                onRefresh={getTasks}
            />
        </View>
    );
}