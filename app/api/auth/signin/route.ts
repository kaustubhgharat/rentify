import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/app/lib/mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." }, 
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

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

    const tokenPayload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    
    const response = NextResponse.json({
        success: true,
        message: "Logged in successfully.",
        user: userToReturn 
    }, { status: 200 });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, 
        path: '/',
    });

    return response;

  } catch (error) {
    console.error("[LOGIN_API_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

