// lib/auth.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function signInWithCredentials(email, password) {
    try {
        if (!email || !password) return { success: false, message: "Email and password are required" };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { success: false, message: "Invalid login credentials" };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return { success: false, message: "Invalid login credentials" };

        return JSON.stringify({ success: true, userID: user.id });
    } catch (error) {
        return JSON.stringify({ success: false, error: error.message });
    }
}

export async function signUpUser(email, password) {
    try {
        console.log("Signing up", email);
        if (!email || !password) return { success: false, message: "Email and password are required" };

        const emailExists = await prisma.user.findUnique({ where: { email: email } });
        console.log("Email exists:", emailExists);
        if (emailExists) return { exists: true, message: "A user with the given email already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        });

        return { success: true, userID: user.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getUserData(userId) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });
        if (!user) return null;

        return user;
    } catch (error) {
        console.error("Error fetching user data from database:", error);
        return null;
    }
}