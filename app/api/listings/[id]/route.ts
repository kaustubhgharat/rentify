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
    const cookieStore = await cookies(); // async call
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // ✅ Correct signature
) {
  try {
    await connectDB();
    const { id } = params; // ✅ Correct usage

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID format" },
        { status: 400 }
      );
    }
    const listing = await Listing.findById(id);
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
  { params }: { params: { id: string } } // ✅ FIX: Changed 'context' to the correct signature
) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken(request);
    const { id } = params; // ✅ FIX: Use 'id' from the correctly destructured params

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id);
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

    // Ensure availableBeds does not exceed bedsPerRoom
    if (updatedData.availableBeds > updatedData.bedsPerRoom) {
      updatedData.availableBeds = updatedData.bedsPerRoom;
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
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

// --- DELETE a listing ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // ✅ FIX: Changed 'context' to the correct signature
) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken(request);
    const { id } = params; // ✅ FIX: Use 'id' from the correctly destructured params

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(id);
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

    await Listing.findByIdAndDelete(id);

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
