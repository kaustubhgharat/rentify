import { NextRequest, NextResponse } from "next/server";
import User from '@/models/User';
import connectDB from "@/lib/mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     // ✨ Expect 'username' instead of 'email'
//     const { username, password } = await request.json();

//     if (!username || !password) {
//       return NextResponse.json({ success: false, error: "Please provide username and password." }, { status: 400 });
//     }

//     // ✨ Find user by username
//     const user = await User.findOne({ username }).select('+password');
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
//     }

//     // ✨ Create JWT payload with 'username'
//     const payload = {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
    
//     const response = NextResponse.json({
//         success: true,
//         message: "Logged in successfully.",
//         user: payload
//     }, { status: 200 });

//     response.cookies.set('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 60 * 60 * 24, // 1 day
//         path: '/',
//     });

//     return response;

//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Please provide username and password." }, { status: 400 });
    }

    const user = await User.findOne({ username }).select('+password');
    
    // ✨ FIX 1: Specific error if the username is not found
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ✨ FIX 2: Specific error if the password is a mismatch
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    // --- Successful Login Logic (remains the same) ---
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    
    const response = NextResponse.json({
        success: true,
        message: "Logged in successfully.",
        user: payload
    }, { status: 200 });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return response;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
  }
}
