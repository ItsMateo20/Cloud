// app/api/auth/session.js
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const session = await getSession(req);
    if (!session) return NextResponse.json({ success: false, code: "UserNotLoggedIn" });
    return NextResponse.json({ success: true, user: session });
}
