"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import {
  MapPin, Wallet, PlusCircle, Users, Search,
  Navigation, Bed, Phone, ShieldCheck, Wrench, Wifi,
  ParkingSquare, UtensilsCrossed, Wind, Tv, Mail,
  WashingMachine, CircleUser, // Added CircleUser icon
} from "lucide-react";
import Link from "next/link";
import { Listing } from "@/types";

interface Filters {
  address: string;
  maxRent: number;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ address: "", maxRent: 5000 });
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

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

  const handleToggleExpand = (listingId: string) => {
    setExpandedCardId((currentId) => currentId === listingId ? null : listingId);
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
          {/* ✨ Corrected link to point to the correct page */}
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
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-slate-500 mt-2 group/maplink">
                      <MapPin size={16} className="mr-1.5 flex-shrink-0 text-slate-400 group-hover/maplink:text-teal-500" />
                      <span className="group-hover/maplink:underline">{listing.address}</span>
                      <Navigation size={14} className="ml-2 text-slate-400 opacity-0 group-hover/maplink:opacity-100 transition-opacity" />
                    </a>

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
                          {Object.entries(listing.amenities).filter(([key, value]) => value === true).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 text-slate-700">
                              {amenityIcons[key]}
                              <span className="capitalize">{key}</span>
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
                </div>
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