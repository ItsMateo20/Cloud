// app/api/auth/login.js
import { signInWithCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log("Request body:", req.body);
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' });
        }

        console.log("Logging in", email);

        const response = await JSON.parse(await signInWithCredentials(email, password));

        if (response.success) {
            const user = { userID: response.userID };
            await createSession(user);

            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json({ success: false, message: 'Login error occurred.', error: response.message });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ success: false, message: 'Login error occurred.', error: error.message });
    }
}