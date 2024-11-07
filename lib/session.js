// lib/session.js

"use server";

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const secret = process.env.AUTH_SECRET;

export async function createSession(req, res, user) {
    if (!user) return NextResponse.json({ success: false, message: 'Invalid user data' });
    const token = jwt.sign(user, secret, {
        expiresIn: '30d',
    });

    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
        maxAge: 30 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });

    return NextResponse.json({ success: true, message: 'Session created' });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;
    if (!token) return null;

    try {
        const user = jwt.verify(token, secret);
        return user;
    } catch (error) {
        console.error("Invalid or expired token", error);
        return null;
    }
}

export async function destroySession(req, res) {
    const cookieStore = await cookies();
    cookieStore.delete('auth');
    return NextResponse.json({ success: true, message: 'Session destroyed' });
}