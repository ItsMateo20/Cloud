// app/api/auth/signup.js
import { signUpUser } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log("Request body:", req.body);
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' });
        }

        console.log("Signing up", email);

        const response = await signUpUser(email, password);

        if (response.success) {
            const user = { userID: response.userID };
            await createSession(user);

            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json({ success: false, message: 'Signup error occurred.', error: response.message });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ success: false, message: 'Signup error occurred.' });
    }
}