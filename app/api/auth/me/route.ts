import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "../../../lib/auth"; // Assuming you have this helper function
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    // Use the helper to get the user ID from the token cookie
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No valid token provided." },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Find the user in the database by their ID, but exclude the password field for security
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // If the user is found, return the full user object
    return NextResponse.json({ success: true, user: user });

  } catch (error) {
    // Log the detailed error on the server for debugging
    console.error("Error in /api/auth/me:", error);

    // Return a generic server error to the client
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

