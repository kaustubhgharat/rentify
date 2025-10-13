import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, email, password, role } = await request.json();

    // ✅ 1. Check for missing fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // ✅ 2. Validate username
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username must be 3–20 characters long and contain only letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }

    // ✅ 3. Validate email (must be Gmail)
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Email must be a valid Gmail address." },
        { status: 400 }
      );
    }

    // ✅ 4. Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
        },
        { status: 400 }
      );
    }

    // ✅ 5. Validate role
    if (!["student", "owner"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role selected." },
        { status: 400 }
      );
    }

    // ✅ 6. Check for existing user by email or username
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

    // ✅ 7. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 8. Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

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
