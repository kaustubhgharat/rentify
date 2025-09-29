import { NextRequest, NextResponse } from "next/server";
import User from '@/models/User';
import connectDB from "@/lib/mongoose";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

// GET the user's favorited listings
export async function GET(request: NextRequest) {
    await connectDB();
    const userId = await getUserIdFromToken(request); // ✅ await here
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const user = await User.findById(userId).populate('favorites');
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, favorites: user.favorites });
}

// POST to add a listing to favorites
export async function POST(request: NextRequest) {
    await connectDB();
    const userId = await getUserIdFromToken(request); // ✅ await here
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    
    const { listingId } = await request.json();
    if (!listingId) return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });

    await User.findByIdAndUpdate(userId, { $addToSet: { favorites: listingId } });
    
    return NextResponse.json({ success: true, message: "Added to favorites" });
}

// DELETE to remove a listing from favorites
export async function DELETE(request: NextRequest) {
    await connectDB();
    const userId = await getUserIdFromToken(request); // ✅ await here
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const { listingId } = await request.json();
    if (!listingId) return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });

    await User.findByIdAndUpdate(userId, { $pull: { favorites: listingId } });

    return NextResponse.json({ success: true, message: "Removed from favorites" });
}