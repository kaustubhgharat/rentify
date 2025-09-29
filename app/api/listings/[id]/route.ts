import { NextRequest, NextResponse } from "next/server";
import Listing from '@/models/Listing';
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export const getUserIdFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
    const cookieStore = await cookies(); // async call
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};


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
    console.log(error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}


// ✨ PUT (update) a listing
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = await getUserIdFromToken(request); // ✅ await here
        const { id } = params;

        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid listing ID" }, { status: 400 });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
        }
        
        // Security Check: Ensure the logged-in user is the owner of the listing
        if (listing.owner.toString() !== userId) {
            return NextResponse.json({ success: false, error: "Not authorized to edit this listing" }, { status: 403 });
        }
        
        const updatedData = await request.json();
        const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

        return NextResponse.json({ success: true, listing: updatedListing });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

// ✨ DELETE a listing
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = await getUserIdFromToken(request); // ✅ await here

        const { id } = params;

        if (!userId) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid listing ID" }, { status: 400 });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
        }
        
        // Security Check: Ensure the logged-in user is the owner
        if (listing.owner.toString() !== userId) {
            return NextResponse.json({ success: false, error: "Not authorized to delete this listing" }, { status: 403 });
        }

        await Listing.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}