import { NextResponse } from "next/server";
import Listing from '@/models/Listing';
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid listing ID" }, { status: 400 });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}