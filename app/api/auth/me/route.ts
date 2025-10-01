import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "../../../lib/auth"; // Import our helper
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    // Use the helper to get the user ID from the token cookie
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Find the user in the database, but exclude the password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: user });

  } catch (error) {
        console.log(error);

    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}