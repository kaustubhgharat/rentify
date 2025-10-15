"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import {
  PlusCircle, Users, Search,
} from "lucide-react";
import Link from "next/link";
import { IRoommatePost } from "@/app/types";
import ListingCard from "@/app/components/RoommatePostCard";

interface Filters {
  address: string;
  maxRent: number;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<IRoommatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ address: "", maxRent: 50000 });



  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/roommates");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: name === "maxRent" ? Number(value) : value }));
  };

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const addressMatch = listing.address.toLowerCase().includes(filters.address.toLowerCase());
      const rentMatch = listing.rent <= filters.maxRent;
      return addressMatch && rentMatch;
    });
  }, [listings, filters]);

 


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-slate-500">Finding your perfect space...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
            Find Your Next Home
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Browse available flats, PGs, and find roommates in Pune.
          </p>
          <Link
            href="/roommates/add"
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircle size={20} />
            Create a Post
          </Link>
        </div>

        <div className="mt-12 mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center sticky top-4 z-10">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Filter by location (e.g., Kothrud, Pune)"
              className="w-full border border-slate-300 rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="maxRent" className="block text-sm font-medium text-slate-700 text-center md:text-left mb-1">
              Max Rent: <span className="font-bold text-teal-600">₹{filters.maxRent.toLocaleString()}</span>
            </label>
            <input
              type="range"
              name="maxRent"
              id="maxRent"
              min="5000"
              max="50000"
              step="1000"
              value={filters.maxRent}
              onChange={handleFilterChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => {
              const listingId = typeof listing._id === "string" ? listing._id : listing._id.toString();
              return (
                <ListingCard
                  key={listingId}
                  listing={listing}
                  
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border col-span-full">
            <Users size={48} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">No Listings Found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
}