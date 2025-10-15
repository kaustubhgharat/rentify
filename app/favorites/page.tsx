"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { Heart, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { IListing, IRoommatePost } from "@/app/types"; // Import IRoommatePost
import { useRouter } from "next/navigation";
import ListingCard from "@/app/components/RoommatePostCard"; // Import the correct card

// --- Tabs Helper Components (No changes here) ---
const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: "",
  setActiveTab: () => {},
});

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Tabs = ({ value, onValueChange, children, ...props }: TabsProps) => (
  <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
    <div {...props}>{children}</div>
  </TabsContext.Provider>
);

const TabsList = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} />
);

type TabsTriggerProps = {
  value: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TabsTrigger = ({ value, children, ...props }: TabsTriggerProps) => {
  const { setActiveTab } = useContext(TabsContext);
  return (
    <button onClick={() => setActiveTab(value)} {...props}>
      {children}
    </button>
  );
};

type TabsContentProps = {
  value: string;
} & React.HTMLAttributes<HTMLDivElement>;

const TabsContent = ({ value, children, ...props }: TabsContentProps) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div {...props}>{children}</div> : null;
};

// --- Favorites Page Component ---
export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favoriteListings, setFavoriteListings] = useState<IListing[]>([]);
  // Use the correct type for roommate posts
  const [favoriteRoommates, setFavoriteRoommates] = useState<IRoommatePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "student") {
        router.push("/signin");
        return;
      }

      const fetchAllFavorites = async () => {
        setIsLoading(true);
        try {
          const [listingsRes, roommatesRes] = await Promise.all([
            fetch("/api/favorites"),
            fetch("/api/favoriteRoommates"),
          ]);

          const safeJsonParse = async (response: Response) => {
            const text = await response.text();
            return text ? JSON.parse(text) : { success: true, favorites: [] };
          };

          const [listingsData, roommatesData] = await Promise.all([
            safeJsonParse(listingsRes),
            safeJsonParse(roommatesRes),
          ]);

          if (listingsData.success) setFavoriteListings(listingsData.favorites);
          if (roommatesData.success) setFavoriteRoommates(roommatesData.favorites);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllFavorites();
    }
  }, [user, authLoading, router]);
  
  // This function will be called by the ListingCard component
  const handleFavoriteToggle = (listingId: string, isNowFavorite: boolean) => {
      // If the item is no longer a favorite, remove it from the state
      if (!isNowFavorite) {
          setFavoriteRoommates((prev) => 
              prev.filter((roommate) => roommate._id.toString() !== listingId)
          );
      }
  };

  // This function handles unfavoriting property listings
  const handleUnfavoriteListing = async (listingId: string) => {
    setFavoriteListings((prev) =>
      prev.filter((listing) => listing._id !== listingId)
    );
    // The API call still happens in the background to update the database
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Your Favorites
          </h1>
          <p className="mt-2 text-slate-500">
            Everything you’ve saved — listings & roommates — all in one place.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center mb-8 bg-white rounded-lg shadow-sm w-fit mx-auto">
            <TabsTrigger
              value="listings"
              className={`px-6 py-2 font-semibold ${
                activeTab === "listings" ? "text-teal-600" : "text-slate-600"
              }`}
            >
              🏠 Listings
            </TabsTrigger>
            <TabsTrigger
              value="roommates"
              className={`px-6 py-2 font-semibold ${
                activeTab === "roommates" ? "text-teal-600" : "text-slate-600"
              }`}
            >
              👯 Roommates
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab Content */}
          <TabsContent value="listings">
            {favoriteListings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
                <Heart size={48} className="mx-auto text-slate-300" />
                <h2 className="text-2xl font-bold mt-4">No Favorite Listings</h2>
                <p className="text-slate-600 my-4">
                  Click the heart icon on a listing to save it here.
                </p>
                <Link
                  href="/listings"
                  className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition"
                >
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {favoriteListings.map((item) => (
                    <div key={item._id} className="group bg-white rounded-xl shadow-md overflow-hidden transition-all border">
                         <div className="relative h-56 w-full">
                           <Image src={item.imageUrls[0]} alt={item.title || "Photo of the listing"} fill className="object-cover"/>
                           <button onClick={() => handleUnfavoriteListing(item._id)} className="absolute top-3 right-3 text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition hover:bg-white" aria-label="Remove from favorites">
                             <Heart size={20} fill="#ef4444" strokeWidth={1.5} />
                           </button>
                         </div>
                         <Link href={`/listings/${item._id}`} className="block p-4">
                           <h2 className="font-bold text-lg text-slate-800 truncate group-hover:text-teal-600">{item.title}</h2>
                           <p className="flex items-center text-slate-500 text-sm mt-1">
                             <MapPin size={14} className="mr-1.5" /> {item.address.split(",").slice(0, 2).join(", ")}
                           </p>
                           <p className="text-xl font-extrabold text-teal-600 mt-3">
                             ₹{item.rentPerMonth.toLocaleString()}
                             <span className="text-sm font-medium text-slate-500"> /month</span>
                           </p>
                         </Link>
                    </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Roommates Tab Content */}
          <TabsContent value="roommates">
            {favoriteRoommates.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
                <Heart size={48} className="mx-auto text-slate-300" />
                <h2 className="text-2xl font-bold mt-4">
                  No Favorite Roommates Yet
                </h2>
                <p className="text-slate-600 my-4">
                  Click the heart icon on a roommate post to save it here.
                </p>
                <Link
                  href="/roommates"
                  className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition"
                >
                  Browse Roommates
                </Link>
              </div>
            ) : (
              // Use the ListingCard component for a consistent UI
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteRoommates.map((roommate) => (
                  <ListingCard
                    key={roommate._id.toString()}
                    listing={roommate}
                    // Since these are on the favorites page, they are always favorited initially
                    initialIsFavorite={true}
                    // Pass the handler function to the card
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

