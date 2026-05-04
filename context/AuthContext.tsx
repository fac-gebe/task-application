import React, { createContext, useContext, useEffect, useState } from 'react';
import { deleteToken, getToken, saveToken } from '../lib/authStorage';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    signIn: (newToken: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [token, setToken] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    // Load token on initial app start
    useEffect(() => {
        const loadStorage = async () => {
            try {
                const storedToken = await getToken();
                if (storedToken) setToken(storedToken);
            } catch (error) {
                console.error('Failed to load token', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStorage();
    }, []);

    const signIn = async (newToken: string) => {
        await saveToken(newToken);
        setToken(newToken);
    };

    const signOut = async () => {
        await deleteToken();
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
