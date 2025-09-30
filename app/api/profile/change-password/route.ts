import { NextRequest, NextResponse } from "next/server";
import User from '../../../models/User';
import connectDB from "../../../lib/mongoose";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const getUserIdFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
        const cookieStore = await cookies(); // async call
        const token = cookieStore.get("token")?.value;
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded.id;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        const { currentPassword, newPassword, confirmPassword } = await request.json();

        // --- Validation ---
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ success: false, error: "Please fill all password fields." }, { status: 400 });
        }
        if (newPassword !== confirmPassword) {
            return NextResponse.json({ success: false, error: "New passwords do not match." }, { status: 400 });
        }
        if (newPassword.length < 6) {
             return NextResponse.json({ success: false, error: "Password must be at least 6 characters." }, { status: 400 });
        }

        // --- Verification ---
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Incorrect current password." }, { status: 401 });
        }

        // --- Update ---
        // The pre-save hook in your User model will automatically hash the new password
        user.password = newPassword;
        await user.save();
        
        return NextResponse.json({ success: true, message: "Password updated successfully." });

    } catch (error) {
                console.log(error);

        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}