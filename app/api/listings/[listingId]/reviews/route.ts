// app/api/listings/[listingId]/reviews/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/app/lib/auth'; // Your custom auth helper
import dbConnect from '@/app/lib/mongoose';
import Review from '@/app/models/Review';
import Listing from '@/app/models/Listing';
import User from '@/app/models/User';

export async function GET(req: NextRequest, { params }: { params: { listingId: string } }) {
  try {
    await dbConnect();
    const reviews = await Review.find({ listing: params.listingId })
      .populate({ path: 'user', model: User, select: 'username image' }) // Use 'image' if you have it, or 'profilePhotoUrl'
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch reviews.' }, { status: 500 });
  }
}
// === CREATE A NEW REVIEW (POST) ===
export async function POST(req: NextRequest, { params }: { params: { listingId: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return NextResponse.json({ message: 'Only students can write reviews.' }, { status: 403 });
    }
    
    const { rating, comment } = await req.json();
    if (!rating || !comment) {
      return NextResponse.json({ message: 'Rating and comment are required.' }, { status: 400 });
    }
    
    const existingReview = await Review.findOne({ user: userId, listing: params.listingId });
    if (existingReview) {
      return NextResponse.json({ message: 'You have already reviewed this listing.' }, { status: 409 });
    }

    const newReview = await Review.create({ rating, comment, user: userId, listing: params.listingId });
    await Listing.findByIdAndUpdate(params.listingId, { $push: { reviews: newReview._id } });

    // ✨ CRUCIAL FIX: Populate the 'user' field before sending the response ✨
    // This adds the user's name and image to the JSON object sent to the frontend.
    await newReview.populate({
      path: 'user',
      model: User,
      select: 'username profilePhotoUrl',
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create review.' }, { status: 500 });
  }
}