import { NextRequest, NextResponse } from "next/server";
import User from '@/models/User';
import connectDB from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    // ✨ Expect 'username' instead of 'name'
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({ success: false, error: "Please provide all required fields." }, { status: 400 });
    }
    
    // Check for existing user by email OR username
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json({ success: false, error: "User with this email already exists." }, { status: 409 });
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json({ success: false, error: "This username is already taken." }, { status: 409 });
    }

    // ✨ Create new user with 'username'
    const newUser = await User.create({ username, email, password, role });

    return NextResponse.json({
      success: true,
      message: "User created successfully.",
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
    }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
  }
}