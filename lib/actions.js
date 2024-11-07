// lib/actions.js
"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserData(value) {
    try {
        const userExists = await checkUserExists(value);
        if (!userExists.exists) return false;

        const userData = await prisma.user.findUnique({
            where: { id: userExists.userID }
        });
        return userData ? userData : false;
    } catch (error) {
        console.error('Error getting user data:', error);
        return false;
    }
}

export async function setUserData(value, data) {
    try {
        const userExists = await checkUserExists(value);
        if (!userExists.exists) return false;

        const user = await prisma.user.update({
            where: { id: userExists.userID },
            data
        });
        return true;
    } catch (error) {
        console.error('Error setting user data:', error);
        return false;
    }
}

export async function checkUserExists(value, field) {
    try {
        if (field) {
            const user = await prisma.user.findUnique({ where: { [field]: value } });
            return user ? { exists: true, username: user.username, userID: user.id } : { exists: false, username: null, userID: null };
        } else {
            const user = await prisma.user.findUnique({ where: { username: value.toLowerCase() } });
            if (user) {
                return { exists: true, username: user.username, userID: user.id, field: 'username' };
            }

            const userByID = await prisma.user.findUnique({ where: { id: value } });
            return userByID ? { exists: true, username: userByID.username, userID: userByID.id, field: 'userID' } : { exists: false, username: null, field: null };
        }
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}