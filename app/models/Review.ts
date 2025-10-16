// models/Review.ts

import { Schema, model, models, Model, Document } from 'mongoose';
import './User'; // Ensure User model is registered before referencing
import './Listing'; // Ensure Listing model is registered before referencing

export interface IReview extends Document {
  rating: number;
  comment: string;
  createdAt: Date;
  user: Schema.Types.ObjectId;
  listing: Schema.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
});

// A user can only review the same listing once
ReviewSchema.index({ user: 1, listing: 1 }, { unique: true });

const Review: Model<IReview> = models.Review || model<IReview>('Review', ReviewSchema);

export default Review;