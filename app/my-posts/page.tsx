"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import {
  MapPin, Wallet, PlusCircle,Bed, Phone, ShieldCheck,
  Wrench, Wifi, ParkingSquare, UtensilsCrossed, Wind, Tv, Mail,
  WashingMachine, CircleUser, Loader, AlertCircle,Edit, Trash2
} from "lucide-react";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        // Fetching only the user's posts from the correct endpoint
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

  const handleToggleExpand = (listingId: string) => {
    setExpandedCardId((currentId) => (currentId === listingId ? null : listingId));
  };
   // ADD THIS FUNCTION TO HANDLE DELETION
  const handleDelete = async (postId: string) => {
    // Ask for confirmation before deleting
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

      // Remove the deleted post from the state to update the UI instantly
      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
      
    } catch (error) {
      alert((error as Error).message);
    }
  };
  const amenityIcons: { [key: string]: React.ReactNode } = {
    wifi: <Wifi size={18} />,
    ac: <Wind size={18} />,
    food: <UtensilsCrossed size={18} />,
    parking: <ParkingSquare size={18} />,
    bed: <Bed size={18} />,
    table: <Tv size={18} />,
    washingMachine: <WashingMachine size={18} />,
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
            My Posted Listings
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Here are all the listings you have created.
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((listing) => {
              const listingId = typeof listing._id === "string" ? listing._id : listing._id.toString();
              const isExpanded = expandedCardId === listingId;

              return (
                <div key={listingId} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200/80">
                  <div className="relative h-56 w-full">
                    <Image src={listing.imageUrls?.[0] || "/placeholder.png"} alt={listing.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-teal-600 text-white text-lg font-bold px-4 py-1.5 rounded-full shadow-md">
                      ₹{listing.rent.toLocaleString()}<span className="font-normal text-sm">/mo</span>
                    </div>
                    <div className="absolute bottom-0 left-0 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-tr-xl">{listing.listingType}</div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="font-bold text-xl text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{listing.title}</h2>
                    <div className="flex items-center text-sm text-slate-500 mt-2">
                      <MapPin size={16} className="mr-1.5 flex-shrink-0 text-slate-400" />
                      <span>{listing.address}</span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm mt-3 flex-grow">
                      {listing.description.substring(0, 100)}
                      {listing.description.length > 100 && !isExpanded ? "..." : ""}
                      {isExpanded && listing.description.substring(100)}
                    </p>

                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-3 border-t pt-4">
                        <h3 className="font-semibold text-slate-700">Financials</h3>
                        <div className="flex justify-between items-center text-sm text-slate-600"><span className="flex items-center gap-2"><Wallet size={16} className="text-teal-500"/>Rent</span> <span className="font-medium">₹{listing.rent.toLocaleString()}/mo</span></div>
                        <div className="flex justify-between items-center text-sm text-slate-600"><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-teal-500"/>Deposit</span> <span className="font-medium">₹{listing.deposit.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-sm text-slate-600"><span className="flex items-center gap-2"><Wrench size={16} className="text-teal-500"/>Maintenance</span> <span className="font-medium">₹{listing.maintenance.toLocaleString()}/mo</span></div>
                      </div>

                      <div className="border-t mt-4 pt-4">
                        <h3 className="font-semibold text-slate-700 mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(listing.amenities).filter(([, value]) => value === true).map(([key]) => (
                            <div key={key} className="flex items-center gap-2 text-slate-700">
                              {amenityIcons[key]}
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t mt-4 pt-4">
                        <h3 className="font-semibold text-slate-700 mb-3">Contact Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-600"><CircleUser size={16} className="text-teal-500"/> <span>{listing.contact.name}</span></div>
                          <div className="flex items-center gap-2 text-slate-600"><Phone size={16} className="text-teal-500"/> <span>{listing.contact.phone}</span></div>
                          {listing.contact.email && <div className="flex items-center gap-2 text-slate-600"><Mail size={16} className="text-teal-500"/> <span>{listing.contact.email}</span></div>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <button onClick={() => handleToggleExpand(listingId)} className="w-full text-center py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                  <div className="border-t p-4 flex items-center justify-end gap-3 bg-slate-50">
                <Link
                  href={`/roommates/edit/${listingId}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit size={16} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(listingId)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}