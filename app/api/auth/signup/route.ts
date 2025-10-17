import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in|edu|net|org|co|gov|info|io|ai|ac\.in|co\.in)$/i;

    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();
    const typoDomains = ["gmial.com", "gamil.com", "gmal.com", "yaho.com", "hotmal.com"];
    if (typoDomains.includes(domain)) {
      return NextResponse.json(
        { success: false, error: "Invalid email domain. Please check your spelling (e.g., gmail.com)." },
        { status: 400 }
      );
    }

    if (username.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists." },
        { status: 409 }
      );
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, error: "This username is already taken." },
        { status: 409 }
      );
    }

    const newUser = await User.create({ username, email, password, role });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
