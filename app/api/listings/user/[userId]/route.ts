import { NextResponse } from "next/server";
import Listing from '@/models/Listing';
import connectDB from "@/lib/mongoose";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const { userId } = params;

    const listings = await Listing.find({ owner: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'Server error fetching listings' }, { status: 500 });
  }
}