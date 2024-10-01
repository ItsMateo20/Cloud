// lib/session.js

"use server";

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const secret = process.env.JWT_SECRET;

export async function createSession(user) {
    const token = jwt.sign(user, secret, {
        expiresIn: '30d',
    });

    setCookie("auth", token, { maxAge: 30 * 24 * 60 * 60, path: '/', cookies });
    return;
}

export async function getSession() {
    const token = getCookie('auth', { cookies });
    if (!token) return null;

    try {
        const user = jwt.verify(token, secret);
        return user;
    } catch (error) {
        console.error("Invalid or expired token", error);
        return null;
    }
}

export async function destroySession() {
    return deleteCookie('auth', { path: '/', cookies });
}
