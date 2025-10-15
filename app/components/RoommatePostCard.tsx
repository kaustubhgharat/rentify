"use client";

import Image from "next/image";
import Link from "next/link";
import { IRoommatePost } from "@/app/types";
import {
  MapPin,
  Wallet,
  Bed,
  Phone,
  ShieldCheck,
  Wrench,
  Wifi,
  ParkingSquare,
  UtensilsCrossed,
  Wind,
  Tv,
  Mail,
  WashingMachine,
  CircleUser,
  Edit,
  Trash2,
  Navigation,
  X,
} from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

// 1. UPDATE PROPS: Add a prop to receive the initial favorite status
interface ListingCardProps {
  listing: IRoommatePost;
  showAdminControls?: boolean;
  onDelete?: (id: string) => void;
  initialIsFavorite?: boolean; // This is the new prop
  onFavoriteToggle?: (listingId: string, isNowFavorite: boolean) => void; // ✅ ADD THIS LINE
  hideFavoriteButton?: boolean; // ✅ NEW
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
  showAdminControls = false,
  onDelete,
  initialIsFavorite = false, // 2. Get the new prop
  onFavoriteToggle,
  hideFavoriteButton = false, // ✅ NEW
}: ListingCardProps) {
  const listingId =
    typeof listing._id === "string" ? listing._id : listing._id.toString();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Initialize state using the prop, not just 'false'
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  // 4. ADD THIS EFFECT: This keeps the heart icon in sync if the prop ever changes.
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus); // Update UI immediately
    onFavoriteToggle?.(listingId, newFavoriteStatus); // ✅ Notify parent

    const method = newFavoriteStatus ? "POST" : "DELETE";

    try {
      const response = await fetch("/api/favoriteRoommates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roommateId: listingId }),
      });

      if (!response.ok) {
        // If the API call fails, revert the UI change
        setIsFavorite(!newFavoriteStatus);
        console.error("Failed to update favorite status on the server.");
      }
    } catch (error) {
      // Also revert on network error
      setIsFavorite(!newFavoriteStatus);
      console.error("An error occurred while updating favorites:", error);
    }
  };

  // Effect to handle body scroll when modal is open/closed
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsModalOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(listingId);
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200/80 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openModal()}
      >
        <div className="relative h-56 w-full">
          {!hideFavoriteButton && (
  <button
    onClick={toggleFavorite}
    className={`absolute top-4 left-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white transition-colors ${
      isFavorite ? "text-red-500" : "text-gray-700"
    }`}
    aria-label="Toggle Favorite"
  >
    <Heart
      size={22}
      strokeWidth={2}
      fill={isFavorite ? "red" : "none"}
      className="transition-transform duration-300"
    />
  </button>
)}


          <Image
            src={listing.imageUrls?.[0] || "/placeholder.png"}
            alt={listing.title || "Roommate Listing"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-teal-600 text-white text-lg font-bold px-4 py-1.5 rounded-full shadow-md">
            ₹{listing.rent.toLocaleString()}
            <span className="font-normal text-sm">/mo</span>
          </div>
          <div className="absolute bottom-0 left-0 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-tr-xl">
            {listing.listingType}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="font-bold text-xl text-slate-800 group-hover:text-teal-600 transition-colors duration-300">
            {listing.title}
          </h2>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              listing.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-slate-500 mt-2 group/maplink"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin
              size={16}
              className="mr-1.5 flex-shrink-0 text-slate-400 group-hover/maplink:text-teal-500"
            />
            <span className="group-hover/maplink:underline">
              {listing.address}
            </span>
            <Navigation
              size={14}
              className="ml-2 text-slate-400 opacity-0 group-hover/maplink:opacity-100 transition-opacity"
            />
          </a>

          <p className="text-slate-600 leading-relaxed text-sm mt-3 flex-grow">
            {listing.description.substring(0, 100)}...{" "}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors"
              aria-label="Close details"
            >
              <X size={24} className="text-slate-700" />
            </button>

            <div className="relative h-64 w-full">
              <Image
                src={listing.imageUrls?.[0] || "/placeholder.png"}
                alt={listing.title || "Roommate Listing"}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-teal-600 text-white text-lg font-bold px-4 py-1.5 rounded-full shadow-md">
                ₹{listing.rent.toLocaleString()}
                <span className="font-normal text-sm">/mo</span>
              </div>
              <div className="absolute bottom-0 left-0 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-tr-xl">
                {listing.listingType}
              </div>
            </div>

            {/* Full Content Section */}

            <div className="p-6">
              <h2 className="font-bold text-2xl text-slate-800">
                {listing.title}
              </h2>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  listing.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-md text-slate-500 mt-2 group/maplink"
                onClick={(e) => e.stopPropagation()}
              >
                <MapPin
                  size={18}
                  className="mr-2 flex-shrink-0 text-slate-400 group-hover/maplink:text-teal-500"
                />

                <span className="group-hover/maplink:underline">
                  {listing.address}
                </span>

                <Navigation
                  size={16}
                  className="ml-2 text-slate-400 opacity-0 group-hover/maplink:opacity-100 transition-opacity"
                />
              </a>

              <p className="text-slate-700 leading-relaxed text-base mt-4">
                {listing.description} {/* Full description in modal */}
              </p>

              <div className="space-y-3 border-t pt-4 mt-6">
                <h3 className="font-semibold text-lg text-slate-700">
                  Financials
                </h3>

                <div className="flex justify-between items-center text-base text-slate-600">
                  <span className="flex items-center gap-2">
                    <Wallet size={18} className="text-teal-500" />
                    Rent
                  </span>{" "}
                  <span className="font-medium">
                    ₹{listing.rent.toLocaleString()}/mo
                  </span>
                </div>

                <div className="flex justify-between items-center text-base text-slate-600">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-teal-500" />
                    Deposit
                  </span>{" "}
                  <span className="font-medium">
                    ₹{listing.deposit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-base text-slate-600">
                  <span className="flex items-center gap-2">
                    <Wrench size={18} className="text-teal-500" />
                    Maintenance
                  </span>{" "}
                  <span className="font-medium">
                    ₹{listing.maintenance.toLocaleString()}/mo
                  </span>
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-lg text-slate-700 mb-3">
                  Amenities
                </h3>

                <div className="grid grid-cols-2 gap-3 text-base">
                  {Object.entries(listing.amenities)

                    .filter(([, value]) => value === true)

                    .map(([key]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-slate-700"
                      >
                        {amenityIcons[key]}

                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <h3 className="font-semibold text-lg text-slate-700 mb-3">
                  Contact Details
                </h3>

                <div className="space-y-2 text-base">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CircleUser size={18} className="text-teal-500" />{" "}
                    <span>{listing.contact.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={18} className="text-teal-500" />{" "}
                    <a
                      href={`tel:${listing.contact.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-teal-600 hover:underline"
                    >
                      {listing.contact.phone}
                    </a>
                  </div>

                  {listing.contact.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={18} className="text-teal-500" />{" "}
                      <a
                        href={`mailto:${listing.contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-teal-600 hover:underline"
                      >
                        {listing.contact.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showAdminControls && (
              <div
                className="border-t p-4 flex items-center justify-end gap-3 bg-slate-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/roommates/edit/${listingId}`}
                  className="inline-flex items-center gap-2 text-md font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit size={18} /> Edit
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="inline-flex items-center gap-2 text-md font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
