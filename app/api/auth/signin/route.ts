import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    const { username, password } = await request.json();

    // 1. Validate Input: Ensure username and password are provided
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    // 2. Find User: Locate the user by their username
    // We use .select('+password') because the password field is excluded by default in the schema
    const user = await User.findOne({ username }).select('+password');
    
    // Handle case where the username does not exist
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." }, // Use a generic message for security
        { status: 401 }
      );
    }

    // 3. Verify Password: Compare the provided password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Handle case where the password is incorrect
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." }, // Use a generic message for security
        { status: 401 }
      );
    }

    // --- THE FIX: PREPARE FULL USER DATA ---
    // Create a 'clean' user object to send to the frontend.
    // This includes all profile details but EXCLUDES the password hash.
    const userToReturn = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
    };

    // 4. Create JWT Token: The token payload should be minimal
    const tokenPayload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d', // Token expires in one day
    });
    
    // 5. Create Response: Send the full user object back to the client
    const response = NextResponse.json({
        success: true,
        message: "Logged in successfully.",
        user: userToReturn // This now contains all profile data
    }, { status: 200 });

    // 6. Set Secure Cookie: The token is stored in an httpOnly cookie for security
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return response;

  } catch (error) {
    // 7. Robust Error Handling
    console.error("[LOGIN_API_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

