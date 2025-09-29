import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // ✨ FIX: Add 'await' to resolve the persistent TypeScript error.
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        
        return NextResponse.json({ success: true, user: decoded });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
}