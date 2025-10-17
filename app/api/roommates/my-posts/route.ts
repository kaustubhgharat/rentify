import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongoose";
import Roommate from "../../../models/Roommate";
import { getUserIdFromRequest } from "../../../lib/auth";  

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const myPosts = await Roommate.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: myPosts });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}