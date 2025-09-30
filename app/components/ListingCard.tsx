"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types";
import {
  MapPin, Wallet, Bed, Phone, ShieldCheck,
  Wrench, Wifi, ParkingSquare, UtensilsCrossed, Wind, Tv, Mail,
  WashingMachine, CircleUser, Edit, Trash2, Navigation
} from "lucide-react";

// Define the props the component will accept
interface ListingCardProps {
  listing: Listing;
  isExpanded: boolean;
  onToggleExpand: () => void;
  showAdminControls?: boolean; // This prop controls the Edit/Delete buttons
  onDelete?: (id: string) => void; // Pass the delete handler
}

// A map of amenity keys to their corresponding icons
const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi size={18} />,
  ac: <Wind size={18} />,
  food: <UtensilsCrossed size={18} />,
  parking: <ParkingSquare size={18} />,
  bed: <Bed size={18} />,
  table: <Tv size={18} />,
  washingMachine: <WashingMachine size={18} />,
};

export default function ListingCard({ 
  listing, 
  isExpanded, 
  onToggleExpand, 
  showAdminControls = false, // Default to false
  onDelete 
}: ListingCardProps) {

  const listingId = typeof listing._id === "string" ? listing._id : listing._id.toString();

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(listingId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200/80">
      {/* Image Section */}
      <div className="relative h-56 w-full">
        <Image src={listing.imageUrls?.[0] || "/placeholder.png"} alt={listing.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-4 right-4 bg-teal-600 text-white text-lg font-bold px-4 py-1.5 rounded-full shadow-md">
          ₹{listing.rent.toLocaleString()}<span className="font-normal text-sm">/mo</span>
        </div>
        <div className="absolute bottom-0 left-0 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-tr-xl">{listing.listingType}</div>
      </div>

      {/* Main Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-bold text-xl text-slate-800 group-hover:text-teal-600 transition-colors duration-300">{listing.title}</h2>
        <a href={`http://maps.google.com/?q=${encodeURIComponent(listing.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-slate-500 mt-2 group/maplink">
            <MapPin size={16} className="mr-1.5 flex-shrink-0 text-slate-400 group-hover/maplink:text-teal-500" />
            <span className="group-hover/maplink:underline">{listing.address}</span>
            <Navigation size={14} className="ml-2 text-slate-400 opacity-0 group-hover/maplink:opacity-100 transition-opacity" />
        </a>

        <p className="text-slate-600 leading-relaxed text-sm mt-3 flex-grow">
          {listing.description.substring(0, 100)}
          {listing.description.length > 100 && !isExpanded ? "..." : ""}
          {isExpanded && listing.description.substring(100)}
        </p>

        {/* Collapsible Details Section */}
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

        {/* View Details Button */}
        <div className="mt-5">
          <button onClick={onToggleExpand} className="w-full text-center py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {/* Conditionally Render Admin Controls */}
      {showAdminControls && (
        <div className="border-t p-4 flex items-center justify-end gap-3 bg-slate-50">
          <Link
            href={`/roommates/edit/${listingId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit size={16} /> Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}