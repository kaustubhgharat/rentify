"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import Link from "next/link";
import { MapPin, Filter, X } from "lucide-react";
import Image from 'next/image';

// Interface for type safety
interface Listing {
  id: number;
  title: string;
  price: number;
  type: "PG" | "Flat" | "Hostel";
  location: string;
  img: string;
}

// Expanded mock data with more details for filtering
const allListings: Listing[] = [
  { id: 1, title: "Modern Hostel near PICT", price: 8500, type: "Hostel", location: "Dhankawadi", img: "/hostel1.jpg" },
  { id: 2, title: "Spacious 2 BHK Flat", price: 22000, type: "Flat", location: "Kothrud", img: "/flat1.jpg" },
  { id: 3, title: "PG for Boys in Hinjewadi", price: 7000, type: "PG", location: "Hinjewadi", img: "/pg1.jpg" },
  { id: 4, title: "Shared PG near FC Road", price: 9000, type: "PG", location: "Deccan", img: "/hostel1.jpg" },
  { id: 5, title: "1 BHK for Students", price: 15000, type: "Flat", location: "Viman Nagar", img: "/flat1.jpg" },
  { id: 6, title: "Girls Hostel with Mess", price: 10000, type: "Hostel", location: "Karve Nagar", img: "/pg1.jpg" },
];

const initialFilters = {
  location: '',
  maxPrice: 30000,
  types: { PG: true, Flat: true, Hostel: true }
};

export default function Listings() {
  const [filters, setFilters] = useState(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'location') {
      setFilters(prev => ({ ...prev, location: value }));
    } else if (name === 'maxPrice') {
      setFilters(prev => ({ ...prev, maxPrice: Number(value) }));
    } else if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        types: { ...prev.types, [name]: checked }
      }));
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredListings = useMemo(() => {
    return allListings.filter(item => {
      const selectedTypes = Object.entries(filters.types)
        .filter(([, checked]) => checked)
        .map(([type]) => type);
      
      return (
        item.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        item.price <= filters.maxPrice &&
        selectedTypes.includes(item.type)
      );
    });
  }, [filters]);
  
  const FilterSidebar = () => (
     <aside className="bg-white p-6 rounded-lg shadow-md h-fit">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">Reset</button>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" id="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., Kothrud" className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price: ₹{filters.maxPrice.toLocaleString()}</label>
            <input type="range" name="maxPrice" id="maxPrice" min="5000" max="30000" step="1000" value={filters.maxPrice} onChange={handleFilterChange} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Listing Type</h3>
            <div className="mt-2 space-y-2">
              {Object.keys(filters.types).map(type => (
                <div key={type} className="flex items-center">
                  <input id={type} name={type} type="checkbox" checked={filters.types[type as keyof typeof filters.types]} onChange={handleFilterChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                  <label htmlFor={type} className="ml-2 block text-sm text-gray-900">{type}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Available Listings in Pune</h1>
        
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                {isFilterOpen ? <X size={18} /> : <Filter size={18} />}
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <FilterSidebar />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <Link key={item.id} href={`/listings/${item.id}`} className="group block bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative h-56 w-full">
                      <Image 
                        src={item.img} 
                        alt={item.title} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{item.type}</span>
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600">{item.title}</h2>
                      <p className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin size={14} className="mr-1.5" /> {item.location}
                      </p>
                      <p className="text-xl font-extrabold text-blue-600 mt-3">
                        ₹{item.price.toLocaleString()} <span className="text-sm font-medium text-gray-500">/ month</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md col-span-full">
                <h3 className="text-xl font-semibold">No Listings Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or click &apos;Reset&apos; to see all listings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}