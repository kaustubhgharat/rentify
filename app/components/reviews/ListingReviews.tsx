// components/reviews/ListingReviews.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, Send } from 'lucide-react';
import Image from 'next/image';

interface UserInfo {
  _id: string;
  username: string | null;
  profilePhotoUrl?: string;
}
interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: UserInfo;
}

interface StarRatingProps {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => setRating(star)} className={`text-3xl transition-colors ${ star <= rating ? 'text-yellow-400' : 'text-neutral-300'} hover:text-yellow-300`}>★</button>
    ))}
  </div>
);

export function ListingReviews({ listingId }: { listingId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}/reviews`);
        if (res.ok) setReviews(await res.json());
      } catch (error) {
        
        toast.error('Could not load reviews.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast.error('Please add a rating and comment.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) {
        throw new Error((await res.json()).message || 'Failed to submit review.');
      }
      const newReview = await res.json();

      setReviews([newReview, ...reviews]);
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error((await res.json()).message || 'Failed to delete.');
      }
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success('Review deleted.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-neutral-200/80 mt-12">
      <h2 className="text-2xl font-bold text-neutral-800 border-b border-neutral-200 pb-4">
        Ratings & Reviews ({reviews.length})
      </h2>

      {isAuthenticated && user?.role === 'student' && (
        <form onSubmit={handleSubmit} className="p-4 my-6 bg-neutral-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-neutral-700">Write a Review</h3>
          <StarRating rating={rating} setRating={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-md mt-4 focus:ring-2 focus:ring-teal-500"
            rows={3}
            placeholder={`How was your experience, ${user.username}?`}
            required
          />
          <button type="submit" disabled={isSubmitting} className="mt-2 w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition disabled:bg-neutral-400">
            <Send size={20} className="mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-6">
        { !isLoading && reviews.length > 0 && (
          reviews.map((review) => (
            <div key={review._id} className="p-4 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-2">
                  {review.user?.profilePhotoUrl ? (
                    <Image
                      src={review.user.profilePhotoUrl}
                      alt={review.user.username || 'User'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4 border-2 border-teal-200">
                      <span className="text-lg font-bold text-teal-700">
                        {review.user?.username ? review.user.username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-neutral-800">{review.user?.username}</p>
                    <p className="text-sm text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {user?._id === review.user._id && (
                  <button onClick={() => handleDelete(review._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div className="text-yellow-400 mb-2 text-xl">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</div>
              <p className="text-neutral-700 whitespace-pre-line">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}