import { NextRequest, NextResponse } from "next/server";
import Listing from '../../../models/Listing';
import connectDB from "../../../lib/mongoose";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
        if (decoded.role !== 'owner') {
             return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
        }
        
        const listings = await Listing.find({ owner: decoded.id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, listings });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}