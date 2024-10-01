// lib/auth.js

'use server';

import db from './database'; // Import your Sequelize models
import bcrypt from 'bcryptjs';

// Sign In
export async function signInWithCredentials(email, password) {
    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return { success: false, message: "Nieprawidłowe dane logowania" };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return { success: false, message: "Nieprawidłowe dane logowania" };

        return { success: true, userID: user.id };
    } catch (error) {
        console.error("Error during sign-in:", error);
        return { success: false, error };
    }
}

// Sign In with Google
export async function signInWithGoogle(schoolInfo) {
    if (!schoolInfo) schoolInfo = { grade: 7, type: 0 };
    try {
        // Since we aren't using Firebase for Google sign-in anymore,
        // you should handle Google authentication here (e.g., using a library like `passport-google-oauth`)

        // This is a placeholder for handling Google sign-in logic
        const userCredential = {}; // Replace with actual Google sign-in logic

        const emailExists = await db.User.findOne({ where: { email: userCredential.user.email } });
        if (emailExists) {
            return { success: true, userID: emailExists.id, newUser: false };
        }

        const user = await db.User.create({
            email: userCredential.user.email,
            password: "google-oauth-password-placeholder", // Consider how you want to handle this
            // Add any other required fields
        });

        return { success: true, userID: user.id, newUser: true };
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        return { success: false, error };
    }
}

// Sign In with Apple (placeholder)
export async function signInWithApple() {
    try {
        return { success: false, error: "Apple Sign In is not supported yet." };
    } catch (error) {
        return { success: false, error };
    }
}

// Sign Up User
export async function signUpUser(email, username, password, registerNotice, registerClass) {
    try {
        if (!registerNotice) return { success: false, message: "Registration notice is required." };

        const emailExists = await db.User.findOne({ where: { email } });
        const usernameExists = await db.User.findOne({ where: { username } });

        if (emailExists || usernameExists) {
            return { exists: true, message: "Użytkownik o podanym adresie e-mail lub nazwie użytkownika już istnieje" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({
            email,
            password: hashedPassword,
            // Include other required fields, like username
        });

        return { success: true, userID: user.id };
    } catch (error) {
        console.error("Error during user registration:", error);
        return { success: false, error: error.message };
    }
}

// Fetch User Data (now from SQLite)
export async function getUserDataFromFirestore(userId) {
    try {
        const user = await db.User.findByPk(userId);
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            // Include any additional fields you want to return
        };
    } catch (error) {
        console.error("Error fetching user data from database:", error);
        return null;
    }
}
