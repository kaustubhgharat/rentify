"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";

interface Listing {
  id: number;
  title: string;
  price: number;
  type: "PG" | "Flat" | "Hostel";
  location: string;
  img: string;
  roomType?: 1 | 2 | 3;
  furnished?: boolean;
}

const allListings: Listing[] = [
  {
    id: 1,
    title: "Modern Hostel near PICT",
    price: 8500,
    type: "Hostel",
    location: "Dhankawadi",
    img: "/hostel1.jpg",
    furnished: false,
  },
  {
    id: 2,
    title: "Spacious 2 BHK Flat",
    price: 22000,
    type: "Flat",
    location: "Kothrud",
    img: "/flat1.jpg",
    roomType: 2,
    furnished: true,
  },
  {
    id: 3,
    title: "PG for Boys in Hinjewadi",
    price: 7000,
    type: "PG",
    location: "Hinjewadi",
    img: "/pg1.jpg",
    roomType: 1,
    furnished: false,
  },
  {
    id: 4,
    title: "Shared PG near FC Road",
    price: 9000,
    type: "PG",
    location: "Deccan",
    img: "/hostel1.jpg",
    roomType: 3,
    furnished: true,
  },
  {
    id: 5,
    title: "1 BHK for Students",
    price: 15000,
    type: "Flat",
    location: "Viman Nagar",
    img: "/flat1.jpg",
    roomType: 1,
    furnished: false,
  },
  {
    id: 6,
    title: "Girls Hostel with Mess",
    price: 10000,
    type: "Hostel",
    location: "Karve Nagar",
    img: "/pg1.jpg",
    furnished: true,
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    }
  }, []);

  const favoriteListings = allListings.filter((item) =>
    favorites.includes(item.id)
  );

  if (favoriteListings.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
          <p className="text-gray-600 mb-6">
            You have not added any listings to your favorites.
          </p>
          <Link
            href="/listings"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse Listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Your Favorite Listings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoriteListings.map((item) => (
            <Link
              key={item.id}
              href={`/listings/${item.id}`}
              className="group block bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl relative"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.type}
                </span>
                <div className="absolute top-4 right-4 text-red-500 bg-white bg-opacity-70 rounded-full p-1">
  <Heart size={24} fill="red" stroke="currentColor" />
</div>

              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600">
                  {item.title}
                </h2>
                <p className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1.5" /> {item.location}
                </p>
                <p className="text-xl font-extrabold text-blue-600 mt-3">
                  ₹{item.price.toLocaleString()}
                  <span className="text-sm font-medium text-gray-500">
                    / month
                  </span>
                </p>
                {item.roomType && (
                  <p className="text-gray-600 text-sm mt-1">{item.roomType} BHK</p>
                )}
                <p className="text-gray-600 text-sm">
                  Furnished: {item.furnished ? "Yes" : "No"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
