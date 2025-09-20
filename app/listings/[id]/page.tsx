import { MapPin, Phone, Wifi, ParkingCircle, UtensilsCrossed, AirVent } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ReactElement } from 'react';

// --- TYPE DEFINITIONS ---
interface Amenity {
  name: string;
  icon: string; // Storing icon name as a string is better practice
}

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  images: string[];
  description: string;
  amenities: Amenity[];
  contact: {
    name: string;
    phone: string;
  };
  mapSrc: string;
}

// --- MOCK DATA FETCH FUNCTION ---
async function getListingData(id: string): Promise<Listing | undefined> {
    const mockListing: Listing = {
        id: "1",
        title: "Modern Hostel near PICT, Pune",
        price: 8500,
        location: "Dhankawadi, Pune",
        type: "Hostel",
        images: ["/hostel1.jpg", "/flat1.jpg", "/pg1.jpg", "/hostel1.jpg"],
        description: "A clean and modern hostel designed for students of PICT and nearby colleges. Features high-speed Wi-Fi, optional daily meals, and 24/7 security. Located just a 5-minute walk from the main campus.",
        amenities: [
            { icon: "Wifi", name: "High-Speed WiFi" },
            { icon: "UtensilsCrossed", name: "Mess Available" },
            { icon: "ParkingCircle", name: "2-Wheeler Parking" },
            { icon: "AirVent", name: "Air Conditioning" }
        ],
        contact: {
            name: "Mr. Sharma",
            phone: "+91 98765 43210"
        },
        // Real Google Maps Embed URL for PICT, Pune
        mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.133285149337!2d73.85040337588118!3d18.47729107021727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eac92b860ce1%3A0x33b353175b3de8f0!2sPune%20Institute%20of%20Computer%20Technology!5e0!3m2!1sen!2sin!4v1678257009852!5m2!1sen!2sin"
    };

    if (id !== "1") return undefined; // Simulate finding only one listing
    return mockListing;
}

// --- COMPONENT ---
export default async function ListingDetail({ params }: { params: { id: string } }) {
    const listing = await getListingData(params.id);
    if (!listing) {
        notFound();
    }
    
    // Map string identifiers to actual icon components
    const iconMap: { [key: string]: ReactElement } = {
        Wifi: <Wifi />,
        UtensilsCrossed: <UtensilsCrossed />,
        ParkingCircle: <ParkingCircle />,
        AirVent: <AirVent />
    };

    return (
        <main className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header: Title & Location */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{listing.title}</h1>
                    <p className="mt-2 flex items-center text-lg text-gray-500">
                        <MapPin size={20} className="mr-2" /> {listing.location}
                    </p>
                </div>

                {/* Image Gallery */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 h-96">
                    <div className="relative col-span-2 row-span-2">
                        <Image src={listing.images[0]} alt="Main listing view" fill className="object-cover rounded-lg" priority sizes="(max-width: 768px) 100vw, 50vw"/>
                    </div>
                    {listing.images.slice(1, 4).map((img, index) => (
                        <div key={img + index} className="relative hidden md:block">
                            <Image src={img} alt={`Listing view ${index + 2}`} fill className="object-cover rounded-lg" sizes="25vw"/>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">About this place</h2>
                        <p className="mt-4 text-gray-600 leading-relaxed">{listing.description}</p>
                        
                        <h3 className="text-xl font-bold text-gray-800 mt-8">Amenities</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {listing.amenities.map(amenity => (
                                <div key={amenity.name} className="flex items-center text-gray-700">
                                    <span className="text-blue-600">{iconMap[amenity.icon]}</span>
                                    <span className="ml-3">{amenity.name}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mt-8">Location</h3>
                        <div className="mt-4 rounded-lg overflow-hidden border">
                            <iframe src={listing.mapSrc} width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                    
                    {/* Sticky Contact Card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-gray-50 p-6 rounded-lg shadow-lg border">
                            <p className="text-3xl font-extrabold text-gray-900">
                                ₹{listing.price.toLocaleString()} <span className="text-lg font-medium text-gray-500">/ month</span>
                            </p>
                            <div className="mt-6">
                                <p className="font-semibold text-gray-700">Contact Person: {listing.contact.name}</p>
                                <a href={`tel:${listing.contact.phone}`} className="mt-4 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    <Phone size={20} className="mr-2"/> Call Now
                                </a>
                                <button className="mt-2 w-full flex items-center justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-lg font-medium text-blue-600 bg-white hover:bg-blue-50">
                                    Send Inquiry
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}