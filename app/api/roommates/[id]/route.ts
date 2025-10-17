import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/app/lib/mongoose'
import Roommate from '@/app/models/Roommate'
import { getUserIdFromRequest } from "@/app/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const post = await Roommate.findById(params.id);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const post = await Roommate.findById(params.id);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    if (post.userId.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await Roommate.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
        console.log(error);

    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let post = await Roommate.findById(params.id);
    
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    if (post.userId.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updatedData = await request.json();
    
    post = await Roommate.findByIdAndUpdate(params.id, updatedData, {
      new: true, 
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
        console.log(error);

    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}