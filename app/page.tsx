import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, CheckCircle, UserPlus } from "lucide-react";
import pict from "@/public/pict.jpg"

// Interface for type safety
interface Listing {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  img: string;
}

// Placeholder data for popular listings
const popularListings: Listing[] = [
  { id: 1, title: "Modern PG for Students", location: "FC Road, Pune", price: "9,500", type: "PG", img: "https://imgs.unsplash.com/photo-1585573759322-38688e14a7c3?q=80&w=2070" },
  { id: 2, title: "Spacious 2BHK Flat", location: "Viman Nagar, Pune", price: "22,000", type: "Flat", img: "https://imgs.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980" },
  { id: 3, title: "Budget-Friendly Hostel", location: "Kothrud, Pune", price: "7,000", type: "Hostel", img: "https://imgs.unsplash.com/photo-1608198399980-87185594b6a9?q=80&w=2070" },
];

export default function Home() {
  return (
    <>
      <main className="bg-white">
        {/* New Split-Screen Hero Section */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 px-4">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Find Your <span className="text-blue-600">Student Home</span> in Pune
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              The easiest way for college students to find verified PGs, flats, hostels, and roommates near campus.
            </p>
            {/* Search Bar */}
            <div className="mt-8 w-full max-w-md mx-auto lg:mx-0 bg-white border border-gray-300 rounded-full shadow-sm flex items-center p-2">
              <MapPin className="text-gray-400 mx-3" size={20} />
              <input type="text" placeholder="Search a location..." className="w-full text-base outline-none border-none bg-transparent text-gray-700"/>
              <button className="bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={pict}
                alt="Modern apartment background"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
             <p className="text-gray-500 mb-12">Find your perfect place in three simple steps.</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6">
                   <Search size={40} className="mx-auto text-blue-600 mb-4"/>
                   <h3 className="font-bold text-xl mb-2">Search & Filter</h3>
                   <p className="text-gray-600">Easily search by location and filter by price and type to find exactly what you need.</p>
                </div>
                 <div className="p-6">
                   <UserPlus size={40} className="mx-auto text-blue-600 mb-4"/>
                   <h3 className="font-bold text-xl mb-2">Connect & Visit</h3>
                   <p className="text-gray-600">Contact owners directly or connect with potential roommates to schedule visits.</p>
                </div>
                 <div className="p-6">
                   <CheckCircle size={40} className="mx-auto text-blue-600 mb-4"/>
                   <h3 className="font-bold text-xl mb-2">Secure Your Place</h3>
                   <p className="text-gray-600">Finalize your choice and move into your new student home with confidence.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Popular Listings Section */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Popular Listings in Pune</h2>
            <p className="text-center text-gray-500 mb-12">Get a glimpse of the best places to stay, recommended by students.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularListings.map((listing) => (
                <Link href={`/listings/${listing.id}`} key={listing.id} className="group block bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative h-56 w-full">
                    <Image
                      src={listing.img}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{listing.type}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{listing.title}</h3>
                    <p className="flex items-center text-gray-500 mb-4">
                      <MapPin size={16} className="mr-2" /> {listing.location}
                    </p>
                    <p className="text-2xl font-extrabold text-blue-600">
                      ₹{listing.price} <span className="text-base font-medium text-gray-500">/ month</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/listings" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all">
                View All Listings
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}