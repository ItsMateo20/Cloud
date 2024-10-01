// app/api/auth/signout.js
import { destroySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
    await destroySession();
    return NextResponse.json({ success: true, code: 'SignedOut' });
}
