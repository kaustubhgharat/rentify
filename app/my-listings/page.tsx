"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { IListing } from "@/app/types";
import { Loader2, Building, PlusCircle, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyListingsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== "owner") {
        router.push("/"); // Redirect if not an owner
        return;
      }

      const fetchMyListings = async () => {
        setIsLoading(true);
        try {
          const res = await fetch("/api/listings/my-listings");
          const data = await res.json();
          if (data.success) {
            setListings(data.listings);
          }
        } catch (error) {
          console.error("Failed to fetch listings", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyListings();
    }
  }, [authUser, authLoading, router]);

  const handleDelete = async (listingId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Remove the listing from the state to update the UI instantly
        setListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        alert("Listing deleted successfully.");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while deleting the listing.");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <Link
            href="/listings/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg text-sm hover:bg-teal-700"
          >
            <PlusCircle size={18} /> Add New Listing
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg leading-tight">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-extrabold text-teal-600 mt-1">
                    ₹{listing.rentPerMonth.toLocaleString()}/mo
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
                    <Link
                      href={`/listings/${listing._id}`}
                      className="text-sm text-teal-600 font-semibold hover:underline"
                    >
                      View
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listings/${listing._id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border flex flex-col items-center gap-4">
            <Building size={48} className="text-slate-400" />
            <p className="text-slate-500 text-lg">
              You haven`t posted any listings yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
