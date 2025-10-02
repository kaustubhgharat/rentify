"use client";

import { useState, useMemo, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { MapPin, Filter, Heart, Wind, Search } from "lucide-react";
import Image from "next/image";
import { IListing } from "@/app/types";
import { useAuth } from "@/app/context/AuthContext";

const initialFilters = {
  address: "",
  minRent: 0,
  maxRent: 50000,
  types: { PG: true, Flat: true, Hostel: true },
  furnished: null as "Furnished" | "Semi-furnished" | "Unfurnished" | null,
  bhkTypes: [] as string[],
  bedsPerRoom: [] as string[],
};

type FilterState = typeof initialFilters;

interface FilterSidebarProps {
  pendingFilters: FilterState;
  handlePendingFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFurnishedChange: (value: FilterState["furnished"]) => void;
  handleMultiSelectChange: (
    filterKey: "bhkTypes" | "bedsPerRoom",
    value: string
  ) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterSidebar = ({
  pendingFilters,
  handlePendingFilterChange,
  handleFurnishedChange,
  handleMultiSelectChange,
  applyFilters,
  resetFilters,
}: FilterSidebarProps) => (
  <aside className="bg-white p-6 rounded-xl border border-neutral-200/80 h-fit sticky top-24 max-w-xs w-full will-change-transform">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-neutral-800">Filters</h2>
      <button
        onClick={resetFilters}
        className="text-sm text-teal-600 hover:underline font-semibold"
      >
        Reset
      </button>
    </div>
    <div className="space-y-6">
      {/* Location Filter */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-neutral-700"
        >
          Location
        </label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            name="address"
            id="location"
            value={pendingFilters.address}
            onChange={handlePendingFilterChange}
            placeholder="e.g., Kothrud, Pune"
            className="w-full border border-neutral-300 rounded-lg shadow-sm py-2 pl-9 pr-3 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>
      </div>

      {/* Rent Range Filter */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Rent Range
        </label>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative w-1/2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              ₹
            </span>
            <input
              type="number"
              name="minRent"
              value={pendingFilters.minRent || ""}
              onChange={handlePendingFilterChange}
              placeholder="Min"
              className="w-full border border-neutral-300 rounded-lg shadow-sm py-2 pl-7 pr-2 focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="relative w-1/2">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              ₹
            </span>
            <input
              type="number"
              name="maxRent"
              value={pendingFilters.maxRent || ""}
              onChange={handlePendingFilterChange}
              placeholder="Max"
              className="w-full border border-neutral-300 rounded-lg shadow-sm py-2 pl-7 pr-2 focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
      
      {/* Other filters... (unchanged) */}
       <div>
        <h3 className="text-sm font-medium text-neutral-700">Listing Type</h3>
        <div className="mt-2 space-y-2">
          {Object.keys(pendingFilters.types).map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={type}
                name={type}
                type="checkbox"
                checked={
                  pendingFilters.types[
                    type as keyof typeof pendingFilters.types
                  ]
                }
                onChange={handlePendingFilterChange}
                className="h-4 w-4 text-teal-600 border-neutral-300 rounded focus:ring-teal-500"
              />
              <label
                htmlFor={type}
                className="ml-2 block text-sm text-neutral-900"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      {pendingFilters.types.Flat && (
        <div>
          <h3 className="text-sm font-medium text-neutral-700">
            Configuration (BHK)
          </h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleMultiSelectChange("bhkTypes", opt)}
                className={`text-xs text-center py-1.5 px-2 rounded-lg border transition ${
                  pendingFilters.bhkTypes.includes(opt)
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {(pendingFilters.types.PG || pendingFilters.types.Hostel) && (
        <div>
          <h3 className="text-sm font-medium text-neutral-700">
            Beds per Room
          </h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4+"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleMultiSelectChange("bedsPerRoom", opt)}
                className={`text-sm text-center py-1.5 px-2 rounded-lg border transition ${
                  pendingFilters.bedsPerRoom.includes(opt)
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-neutral-700">Furnishing</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {["Furnished", "Semi-furnished", "Unfurnished"].map((opt) => (
            <button
              key={opt}
              onClick={() =>
                handleFurnishedChange(opt as typeof initialFilters.furnished)
              }
              className={`text-sm py-1.5 px-2 rounded-lg border transition ${
                pendingFilters.furnished === opt
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white hover:bg-neutral-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {pendingFilters.furnished && (
          <button
            onClick={() => handleFurnishedChange(null)}
            className="text-xs text-neutral-500 hover:text-red-600 mt-2"
          >
            Clear
          </button>
        )}
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-teal-700 transition"
      >
        Apply Filters
      </button>
    </div>
  </aside>
);

export default function ListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [allListings, setAllListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pendingFilters, setPendingFilters] = useState(initialFilters);
  
  // ▼▼▼ KEY CHANGE: Restored full useEffect logic for fetching data on load ▼▼▼
  useEffect(() => {
    // Fetch all listings
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        if (data.success) {
          setAllListings(data.listings);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();

    // Fetch user's favorites if they are an authenticated student
    if (isAuthenticated && user?.role === "student") {
      const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites");
            const data = await res.json();
            if (data.success) {
                // Store just the listing IDs for easy checking
                setFavorites(data.favorites.map((fav: IListing) => fav._id));
            }
        } catch (error) {
            console.error("Failed to fetch favorites:", error)
        }
      };
      fetchFavorites();
    }
  }, [isAuthenticated, user]);

  const toggleFavorite = async (listingId: string) => {
    if (!isAuthenticated) {
      alert("Please sign in to add favorites.");
      return;
    }

    const isFavorited = favorites.includes(listingId);

    // Optimistic UI update for a responsive feel
    setFavorites((prev) =>
      isFavorited ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );

    // API call to sync with the backend
    try {
      await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      // If the API call fails, revert the change in the UI
      setFavorites((prev) =>
        isFavorited
          ? [...prev, listingId]
          : prev.filter((id) => id !== listingId)
      );
    }
  };
  
  // All filter handler functions (unchanged)
  const handlePendingFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPendingFilters((prev) => {
      if (type === "text" || type === "number") {
        if (name === "minRent" || name === "maxRent") {
          const numValue = value === "" ? 0 : parseInt(value, 10);
          return { ...prev, [name]: isNaN(numValue) ? 0 : numValue };
        }
        if (name === "address") {
          return { ...prev, address: value };
        }
      }
      if (type === "checkbox") {
        if (name === "PG" || name === "Flat" || name === "Hostel") {
          return { ...prev, types: { ...prev.types, [name]: checked } };
        }
      }
      return prev;
    });
  };

  const handleFurnishedChange = (value: typeof initialFilters.furnished) => {
    setPendingFilters((prev) => ({ ...prev, furnished: value }));
  };

  const handleMultiSelectChange = (
    filterKey: "bhkTypes" | "bedsPerRoom",
    value: string
  ) => {
    setPendingFilters((prev) => {
      const currentValues = prev[filterKey];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterKey]: newValues };
    });
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setPendingFilters(initialFilters);
    setFilters(initialFilters);
  };

  // useMemo for filtering logic (unchanged)
  const filteredListings = useMemo(() => {
    const selectedTypes = Object.entries(filters.types)
      .filter(([, checked]) => checked)
      .map(([type]) => type);

    return allListings.filter((item) => {
      const minPriceMatch = item.rentPerMonth >= (filters.minRent || 0);
      const maxPriceMatch =
        !filters.maxRent || item.rentPerMonth <= filters.maxRent;
      const priceMatch = minPriceMatch && maxPriceMatch;

      const typeMatch = selectedTypes.includes(item.listingType);
      const locationMatch = item.address
        .toLowerCase()
        .includes(filters.address.toLowerCase());
      const furnishedMatch =
        !filters.furnished || item.furnished === filters.furnished;
      const bhkMatch =
        filters.bhkTypes.length === 0 ||
        (item.listingType === "Flat" &&
          filters.bhkTypes.includes(item.bhkType || ""));
      const bedsMatch =
        filters.bedsPerRoom.length === 0 ||
        ((item.listingType === "PG" || item.listingType === "Hostel") &&
          filters.bedsPerRoom.includes(item.bedsPerRoom || ""));

      return (
        typeMatch &&
        locationMatch &&
        priceMatch &&
        furnishedMatch &&
        bhkMatch &&
        bedsMatch
      );
    });
  }, [filters, allListings]);

  // Main return JSX (unchanged, but now the favorite button will work correctly)
  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-neutral-900 mb-8 text-center">
          Available Listings
        </h1>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <Filter size={18} />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
            <FilterSidebar
              pendingFilters={pendingFilters}
              handlePendingFilterChange={handlePendingFilterChange}
              handleFurnishedChange={handleFurnishedChange}
              handleMultiSelectChange={handleMultiSelectChange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Finding best places for you in Pune...</p>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-neutral-200/80"
                  >
                    <div className="relative h-56 w-full">
                      <Image
                        src={item.imageUrls[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        quality={75}
                      />
                      <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {item.listingType}
                      </span>
                      {isAuthenticated && user?.role !== "owner" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(item._id);
                          }}
                          className="absolute top-3 right-3 text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition hover:bg-white"
                          aria-label="Add to favorites"
                        >
                          <Heart
                            size={20}
                            fill={
                              favorites.includes(item._id)
                                ? "#ef4444"
                                : "none"
                            }
                            strokeWidth={1.5}
                          />
                        </button>
                      )}
                    </div>
                    <Link href={`/listings/${item._id}`} className="block p-4">
                      <h2 className="font-bold text-lg text-neutral-800 truncate group-hover:text-teal-600 transition">
                        {item.title}
                      </h2>
                      <p className="flex items-center text-neutral-500 text-sm mt-1">
                        <MapPin
                          size={14}
                          className="mr-1.5 flex-shrink-0"
                        />{" "}
                        {item.address.split(",").slice(0, 2).join(", ")}
                      </p>
                      <div className="flex items-baseline justify-between mt-4">
                        <p className="text-xl font-extrabold text-teal-600">
                          ₹{item.rentPerMonth.toLocaleString()}
                          <span className="text-sm font-medium text-neutral-500">
                            /month
                          </span>
                        </p>
                        <span className="text-xs font-semibold text-neutral-600">
                          {item.furnished}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border col-span-full">
                <Wind size={48} className="mx-auto text-neutral-400" />
                <h3 className="mt-4 text-xl font-semibold text-neutral-800">
                  No Listings Found
                </h3>
                <p className="text-neutral-500 mt-2">
                  Try adjusting your filters or click Reset to see all available
                  places.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}