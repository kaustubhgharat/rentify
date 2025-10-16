// app/my-posts
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IRoommatePost } from "@/app/types";
import { PlusCircle, Loader, AlertCircle } from "lucide-react";
import ListingCard from "@/app/components/RoommatePostCard"; // <-- IMPORT THE NEW COMPONENT

export default function MyPostsPage() {
  const [posts, setPosts] = useState<IRoommatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (your fetchMyPosts function remains the same)
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/roommates/my-posts');
        if (!res.ok) {
          throw new Error('Failed to fetch your posts. Please log in again.');
        }
        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const res = await fetch(`/api/roommates/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error("Failed to delete post.");
      }
      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-teal-600" />
        <p className="ml-2 text-lg text-neutral-600">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
            My Posts
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Here are all the posts you have created.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
            <PlusCircle className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-xl font-semibold text-neutral-800">No posts yet</h3>
            <p className="mt-1 text-neutral-500">You haven`t created any listings.</p>
            <div className="mt-6">
              <Link href="/roommates/add" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-transform transform hover:scale-105">
                Create your First Post
              </Link>
            </div>
          </div>
        ): (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((listing) => {
              const listingId = typeof listing._id === "string" ? listing._id : listing._id.toString();
              return (
                //  ▼▼▼ USE THE NEW COMPONENT HERE ▼▼▼
                <ListingCard
                  key={listingId}
                  listing={listing}
                  showAdminControls={true} 
                  onDelete={handleDelete}
                  hideFavoriteButton={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}