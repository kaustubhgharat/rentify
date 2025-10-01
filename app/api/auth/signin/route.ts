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

    // Validate that username and password were provided
    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Please provide username and password." }, { status: 400 });
    }

    // Find the user by their username and include the password for comparison
    const user = await User.findOne({ username }).select('+password');
    
    // ✨ FIX 1: Specific error if the username is not found
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // ✨ FIX 2: Specific error if the password is a mismatch
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    // --- Successful Login Logic (remains the same) ---
    // Create the payload for the JWT token
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Sign the token with your secret key, setting it to expire in 1 day
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    
    // Create a successful JSON response
    const response = NextResponse.json({
        success: true,
        message: "Logged in successfully.",
        user: payload
    }, { status: 200 });

    // Set the token in a secure, httpOnly cookie. This is crucial for authentication.
    response.cookies.set('token', token, {
        httpOnly: true, // The cookie cannot be accessed by client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 60 * 60 * 24, // 1 day expiration
        path: '/', // The cookie is available for all pages
    });

    // Return the response to the client
    return response;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
  }
}