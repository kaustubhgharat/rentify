// app/api/reviews/[reviewId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongoose';
import Review from '@/app/models/Review';
import Listing from '@/app/models/Listing';

export async function DELETE(req: NextRequest, { params }: { params: { reviewId: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    await dbConnect();
    const review = await Review.findById(params.reviewId);
    if (!review) {
      return NextResponse.json({ message: 'Review not found.' }, { status: 404 });
    }

    // Authorization: Ensure the user deleting is the one who created it
    if (review.user.toString() !== userId) {
      return NextResponse.json({ message: 'Not authorized.' }, { status: 403 });
    }

    await Review.findByIdAndDelete(params.reviewId);
    await Listing.findByIdAndUpdate(review.listing, { $pull: { reviews: review._id } });

    return NextResponse.json({ message: 'Review deleted successfully.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete review.' }, { status: 500 });
  }
}