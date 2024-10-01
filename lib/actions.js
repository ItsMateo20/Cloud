"use server";

import db from '@/lib/database';

export async function getUserData(value) {
    try {
        const userExists = await checkUserExists(value);
        if (!userExists.exists) return false;

        const userData = await db.User.findByPk(userExists.userID);
        return userData ? userData.toJSON() : false;
    } catch (error) {
        console.error('Error getting user data:', error);
        return false;
    }
}

export async function setUserData(value, data) {
    try {
        const userExists = await checkUserExists(value);
        if (!userExists.exists) return false;

        const user = await db.User.findByPk(userExists.userID);
        if (user) {
            await user.update(data); // Update user data
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error setting user data:', error);
        return false;
    }
}

export async function checkUserExists(value, field) {
    try {
        if (field) {
            const user = await db.User.findOne({ where: { [field]: value } });
            return user ? { exists: true, username: user.username, userID: user.id } : { exists: false, username: null, userID: null };
        } else {
            const user = await db.User.findOne({ where: { username: value.toLowerCase() } });
            if (user) {
                return { exists: true, username: user.username, userID: user.id, field: 'username' };
            }

            const userByID = await db.User.findOne({ where: { id: value } });
            return userByID ? { exists: true, username: userByID.username, userID: userByID.id, field: 'userID' } : { exists: false, username: null, field: null };
        }
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}
