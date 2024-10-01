// app/api/auth/signin.js
import { signInWithCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { FirebaseError } from 'firebase/app';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' });
        }

        const response = await signInWithCredentials(email, password);

        if (response.success) {
            const user = { userID: response.userID };
            await createSession(user);

            return NextResponse.json({ success: true, user });
        } else {
            if (response.error instanceof FirebaseError) {
                switch (response.error.code) {
                    case 'auth/invalid-credential':
                        return NextResponse.json({ success: false, message: 'Invalid login credentials.' });
                    case 'auth/user-disabled':
                        return NextResponse.json({ success: false, message: 'Account is disabled.' });
                    case 'auth/invalid-email':
                        return NextResponse.json({ success: false, message: 'Invalid email format.' });
                    default:
                        return NextResponse.json({ success: false, message: 'Login error occurred.' });
                }
            } else {
                return NextResponse.json({ success: false, message: 'Login error occurred.' });
            }
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ success: false, message: 'Login error occurred.' });
    }
}
