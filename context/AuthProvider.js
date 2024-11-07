// context/AuthProvider.js

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserFromSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.success === false) {
                        if (userData.code === 'not_authenticated') return setUser(null);
                    } else setUser(userData);
                }
            } catch (error) {
                console.error('Failed to load user session:', error);
            }
            setLoading(false);
        };
        loadUserFromSession();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                router.refresh();
            }
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const signup = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
            }
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);