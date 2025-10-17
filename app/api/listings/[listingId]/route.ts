import { NextRequest, NextResponse } from "next/server";
import Listing from "../../../models/Listing";
import connectDB from "../../../lib/mongoose";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export const getUserIdFromToken = async (
  request: NextRequest
): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const { listingId } = params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID format" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken(request);
    const { listingId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.owner.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to edit this listing" },
        { status: 403 }
      );
    }

    const updatedData = await request.json();

    if (updatedData.availableBeds > updatedData.bedsPerRoom) {
      updatedData.availableBeds = updatedData.bedsPerRoom;
    }

    const updatedListing = await Listing.findByIdAndUpdate(listingId, updatedData, {
      new: true,
    });

    return NextResponse.json({ success: true, listing: updatedListing });
  } catch (error) {
    console.log("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken(request);
    const { listingId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.owner.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to delete this listing" },
        { status: 403 }
      );
    }

    await Listing.findByIdAndDelete(listingId);

    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.log("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
