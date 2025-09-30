import { NextRequest, NextResponse } from "next/server";
import User from '../../models/User';
import connectDB from "../../lib/mongoose";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper to get user ID from token
export const getUserIdFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
    const cookieStore = await cookies(); // async call
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

// GET current user's profile
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}

// PUT (update) current user's profile
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        // ✨ FIX 1: Added 'await' to get the resolved value
        const userId = await getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }
        const { username, email } = await request.json();
        if (!username || !email) {
            return NextResponse.json({ success: false, error: "Username and email are required." }, { status: 400 });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
       // ✨ FIX 2: Replaced 'any' with a more specific type to solve the ESLint error
       if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
           return NextResponse.json({ success: false, error: "Username or email is already taken." }, { status: 409 });
       }
       return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}