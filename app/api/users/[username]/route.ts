import User from '../../../models/User';
import connectDB from "../../../lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    await connectDB();
    const { username } = params;

    // Find user by username, but exclude the password field for security
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}