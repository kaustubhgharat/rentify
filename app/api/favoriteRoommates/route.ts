//app/api/favoriteRoommates/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User";
import connectDB from "../../lib/mongoose";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Roommate from "../../models/Roommate"; // make sure this exists

export const getUserIdFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

// GET the user's favorited roommates
export async function GET(request: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromToken(request);
  if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

  const user = await User.findById(userId).populate('favoriteRoommates');
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, favorites: user.favoriteRoommates });
}

// POST to add a roommate to favorites
export async function POST(request: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromToken(request);
  if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  
  const { roommateId } = await request.json();
  if (!roommateId) return NextResponse.json({ success: false, error: "Roommate ID is required" }, { status: 400 });

  await User.findByIdAndUpdate(userId, { $addToSet: { favoriteRoommates: roommateId } });
  return NextResponse.json({ success: true, message: "Added to favorites" });
}

// DELETE to remove a roommate from favorites
export async function DELETE(request: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromToken(request);
  if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

  const { roommateId } = await request.json();
  if (!roommateId) return NextResponse.json({ success: false, error: "Roommate ID is required" }, { status: 400 });

  await User.findByIdAndUpdate(userId, { $pull: { favoriteRoommates: roommateId } });
  return NextResponse.json({ success: true, message: "Removed from favorites" });
}
