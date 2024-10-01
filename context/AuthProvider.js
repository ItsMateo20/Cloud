// context/AuthProvider.js

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithCredentials, signInWithGoogle, signInWithApple, signUpUser } from '@/lib/auth';
import { getUserData, setUserData } from '@/lib/actions';
import { createSession, getSession, destroySession } from '@/lib/session';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserFromSession = async () => {
            const sessionUser = await getSession();
            if (sessionUser) {
                const userData = await getUserData(sessionUser.userID);
                setUser(userData);
            }
            setLoading(false);
        };
        loadUserFromSession();
    }, []);

    const login = async (provider, email, password, schoolInfo) => {
        setLoading(true);
        let response;

        if (provider === 'google') {
            response = await signInWithGoogle(schoolInfo);
        } else if (provider === 'apple') {
            response = await signInWithApple(schoolInfo);
        } else {
            response = await signInWithCredentials(email, password);
        }

        if (response.success && !response.newUser) {
            const user = { userID: response.userID };
            await createSession(user);
            const userData = await getUserData(response.userID);
            setUser(userData);
            router.refresh();
        }
        setLoading(false);
        return response;
    };

    const signup = async (email, username, password, notice, schoolInfo) => {
        const schoolInfo2 = JSON.parse(schoolInfo);
        try {
            setLoading(true);
            const response = await signUpUser(email, username, password, notice, schoolInfo2);

            if (response.success) {
                const user = { userID: response.userID };
                await createSession(user);
                const newUserData = await getUserData(response.userID);
                setUser(newUserData);
            }
            setLoading(false);
            return response;
        } catch (error) {
            console.log("AuthProvider signup error", error);
            setLoading(false);
            return { success: false, error };
        }
    };

    const logout = async (redirectTo) => {
        await destroySession();
        setUser(null);
        router.push(redirectTo || '/app');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
