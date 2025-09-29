"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { IListing } from "@/types";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favoriteListings, setFavoriteListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      // Redirect if not logged in or not a student
      if (!user || user.role !== 'student') {
        router.push('/signin');
        return;
      }
      
      const fetchFavorites = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/favorites');
          const data = await res.json();
          if (data.success) {
            setFavoriteListings(data.favorites);
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [user, authLoading, router]);

  const handleUnfavorite = async (listingId: string) => {
    // Optimistic UI update
    setFavoriteListings(prev => prev.filter(listing => listing._id !== listingId));
    
    // API Call
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });
  };

  if (authLoading || isLoading) {
      return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-teal-600"/></div>
  }

  return (
    <main className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900">Your Favorites</h1>
            <p className="mt-2 text-slate-500">The places you`ve saved, all in one spot.</p>
        </div>

        {favoriteListings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <Heart size={48} className="mx-auto text-slate-300" />
            <h2 className="text-2xl font-bold mt-4">No Favorites Yet</h2>
            <p className="text-slate-600 my-4">Click the heart icon on a listing to save it here.</p>
            <Link href="/listings" className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteListings.map((item) => (
              <div key={item._id} className="group bg-white rounded-xl shadow-md overflow-hidden transition-all border">
                <div className="relative h-56 w-full">
                  <Image src={item.imageUrls[0]} alt={item.title} fill className="object-cover" />
                  <button onClick={() => handleUnfavorite(item._id)} className="absolute top-3 right-3 text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition hover:bg-white" aria-label="Remove from favorites">
                    <Heart size={20} fill="#ef4444" strokeWidth={1.5} />
                  </button>
                </div>
                <Link href={`/listings/${item._id}`} className="block p-4">
                  <h2 className="font-bold text-lg text-slate-800 truncate group-hover:text-teal-600">{item.title}</h2>
                  <p className="flex items-center text-slate-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1.5" /> {item.address.split(',').slice(0, 2).join(', ')}
                  </p>
                  <p className="text-xl font-extrabold text-teal-600 mt-3">
                    ₹{item.rentPerMonth.toLocaleString()}
                    <span className="text-sm font-medium text-slate-500">/month</span>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}