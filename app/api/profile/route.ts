import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User";
import connectDB from "../../lib/mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper to get user ID from token (no changes needed)
export const getUserIdFromToken = async (
  request: NextRequest
): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
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
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// PUT (update) current user's profile
// NO CHANGES ARE NEEDED HERE. It already accepts a string for the photo,
// and a Base64 Data URL is a string.
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Destructure all the new fields from the request body
    const { username, email, profilePhotoUrl, bio, phone, location } =
      await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: "Username and email are required." },
        { status: 400 }
      );
    }

    const updateData = {
      username,
      email,
      profilePhotoUrl: profilePhotoUrl ?? "", // allow empty string or base64
      bio: bio ?? "",
      phone: phone ?? "",
      location: location ?? "",
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    // Handle potential duplicate key errors (e.g., if email is already taken)
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Username or email is already in use." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
