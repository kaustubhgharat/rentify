import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "../../../lib/auth"; // Assuming you have this helper function
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No valid token provided." },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: user });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

