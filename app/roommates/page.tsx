"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import Image from 'next/image';
import { MapPin, Wallet } from 'lucide-react';
import Link from 'next/link';

// Interface for type safety
interface Roommate {
  id: number;
  name: string;
  msg: string;
  budget: number;
  location: string;
  img: string;
}

// Added unique IDs to the data
const allRoommates: Roommate[] = [
  { id: 1, name: "Rahul Sharma", msg: "Final year engineering student at COEP. Clean, friendly, and focused on studies. Looking for a flatmate for a 2BHK in Wakad.", budget: 6000, location: "Wakad", img: "/hostel1.jpg" },
  { id: 2, name: "Priya Singh", msg: "Law student, loves cooking and music. Need 2 cool flatmates for a spacious 3BHK I found in Kothrud.", budget: 10000, location: "Kothrud", img: "/flat1.jpg" },
  { id: 3, name: "Amit Desai", msg: "Working professional in IT. Looking for a single room in a shared flat near Hinjewadi Phase 1. Non-smoker.", budget: 8000, location: "Hinjewadi", img: "/pg1.jpg" },
  { id: 4, name: "Sneha Patil", msg: "Medical student looking for a quiet and clean female flatmate for a 1BHK near Karve Nagar.", budget: 7500, location: "Karve Nagar", img: "/hostel1.jpg" }
];

export default function Roommates() {
  const [filters, setFilters] = useState({
    location: '',
    maxBudget: 15000,
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredRoommates = useMemo(() => {
    return allRoommates.filter(r => 
      r.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      r.budget <= filters.maxBudget
    );
  }, [filters]);

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Find Your Next Roommate</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Connect with students and professionals looking for shared housing in Pune.
          </p>
          <Link href="/roommates/new" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            + Post Your Profile
          </Link>
        </div>
        
        {/* Filters Section */}
        <div className="mt-12 mb-8 bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-4 items-center">
            <input 
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Filter by location (e.g., Kothrud)"
                className="w-full md:w-1/2 border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="w-full md:w-1/2">
                <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700 text-center md:text-left">
                    Max Budget: ₹{Number(filters.maxBudget).toLocaleString()}
                </label>
                <input 
                    type="range"
                    name="maxBudget"
                    id="maxBudget"
                    min="5000" max="15000" step="500"
                    value={filters.maxBudget}
                    onChange={handleFilterChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
        </div>

        {/* Roommates Grid */}
        {filteredRoommates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoommates.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 flex items-center">
                  <Image 
                    className="rounded-full object-cover" 
                    src={r.img} 
                    alt={r.name}
                    width={80}  // Explicit width in pixels
                    height={80} // Explicit height in pixels
                  />
                  <div className="ml-4">
                    <h2 className="font-bold text-xl text-gray-800">{r.name}</h2>
                    <p className="text-sm text-gray-500">Student in Pune</p>
                  </div>
                </div>
                
                <div className="px-6 pb-6 border-t border-gray-100 flex-grow">
                  <p className="text-gray-600 mt-4">{r.msg}</p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Wallet size={14} className="mr-1.5" /> ₹{r.budget.toLocaleString()}/mo
                    </span>
                     <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <MapPin size={14} className="mr-1.5" /> {r.location}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Contact {r.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">No Roommates Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters to find more results.</p>
          </div>
        )}
      </div>
    </main>
  );
}