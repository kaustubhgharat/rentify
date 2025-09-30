import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongoose";
import Roommate from "../../../models/Roommate";
import { getUserIdFromRequest } from "../../../lib/auth";   //Import the authentication helper

export async function GET(request: NextRequest) {
  try {
    // 1. Use the helper to get the user's ID from the token cookie.
    const userId = getUserIdFromRequest(request);
    // 2. If no valid user ID is found, deny access.
    // This is what sends the "Unauthorized" status back to the frontend.
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 3. Find all posts in the database where the `userId` field
    // matches the ID from the authenticated user's token.
    const myPosts = await Roommate.find({ userId: userId }).sort({ createdAt: -1 });

    // 4. Return the found posts successfully.
    return NextResponse.json({ success: true, data: myPosts });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}