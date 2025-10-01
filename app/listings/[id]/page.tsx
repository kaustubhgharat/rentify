// app/listings/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { IListing } from "@/app/types";
import { 
  MapPin, Phone, Mail, Wifi, Bed, AirVent, ParkingCircle, 
  UtensilsCrossed, Table, WashingMachine, ShieldCheck, Wrench, Home, Users
} from "lucide-react";
import { ReactElement } from "react";

async function getListing(id: string): Promise<IListing | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/listings/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.listing;
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    return null;
  }
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }
  
  const amenityIcons: { [key: string]: ReactElement } = {
    wifi: <Wifi size={20} />,
    ac: <AirVent size={20} />,
    food: <UtensilsCrossed size={20} />,
    parking: <ParkingCircle size={20} />,
    bed: <Bed size={20} />,
    table: <Table size={20} />,
    washingMachine: <WashingMachine size={20} />,
  };
  
  const availableAmenities = Object.entries(listing.amenities)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
    
  // ✨ FIX: Correctly formatted Google Maps Embed URL using latitude and longitude for accuracy.
  // The 'place' mode will drop a pin directly at the coordinates.
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=${listing.latitude},${listing.longitude}&zoom=16`;

  return (
    <main className="bg-neutral-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header: Title & Location */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-teal-600 bg-teal-100 px-3 py-1 rounded-full">{listing.listingType}</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">{listing.title}</h1>
          <p className="mt-2 flex items-center text-lg text-neutral-500">
            <MapPin size={20} className="mr-2 flex-shrink-0" /> {listing.address}
          </p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-96">
          <div className="relative col-span-2 row-span-2">
            <Image src={listing.imageUrls[0]} alt="Main listing view" fill className="object-cover rounded-xl" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {listing.imageUrls.slice(1, 4).map((img, index) => (
            <div key={index} className="relative hidden md:block">
              <Image src={img} alt={`Listing view ${index + 2}`} fill className="object-cover rounded-xl" sizes="25vw" />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-neutral-200/80">
            <h2 className="text-2xl font-bold text-neutral-800 border-b border-neutral-200 pb-4">About this place</h2>
            <p className="mt-4 text-neutral-600 leading-relaxed whitespace-pre-line">{listing.description}</p>

            <section className="mt-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-neutral-700">
                {listing.listingType === 'Flat' && listing.bhkType && (
                  <div className="flex items-center gap-2"><Home size={18} className="text-teal-600"/><span className="font-semibold">Configuration:</span> {listing.bhkType}</div>
                )}
                {(listing.listingType === 'PG' || listing.listingType === 'Hostel') && listing.bedsPerRoom && (
                  <div className="flex items-center gap-2">
                    <Bed size={18} className="text-teal-600"/>
                    <span className="font-semibold">Room Sharing:</span>
                    {listing.bedsPerRoom === '1' ? '1 bed' : `${listing.bedsPerRoom} beds`}
                  </div>
                )}
                {/* Conditionally render gender only if it's not 'Any' */}
                {listing.gender && listing.gender !== 'Any' && (
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-teal-600" />
                        <span className="font-semibold">Preferred Gender:</span> {listing.gender}
                    </div>
                )}
                <div className="flex items-center gap-2"><span className="font-semibold">Furnishing:</span> {listing.furnished}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Electricity:</span> Bill paid by {listing.electricityBillBy}</div>
              </div>
            </section>

            {availableAmenities.length > 0 && (
              <section className="mt-8">
                  <h3 className="text-xl font-bold text-neutral-800">Amenities</h3>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      {availableAmenities.map((key) => (
                          <div key={key} className="flex items-center text-neutral-700">
                              <span className="text-teal-600">{amenityIcons[key]}</span>
                              <span className="ml-3 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </div>
                      ))}
                  </div>
              </section>
            )}

            {/* Location Section */}
            <section className="mt-8">
                <h3 className="text-xl font-bold text-neutral-800">Location</h3>
                <div className="mt-4 rounded-lg overflow-hidden border border-neutral-200">
                    <iframe 
                      src={mapEmbedUrl} 
                      width="100%" 
                      height="450" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade" 
                      title="Listing Location"
                    />
                </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-neutral-200/80">
                <p className="text-3xl font-extrabold text-neutral-900">
                    ₹{listing.rentPerMonth.toLocaleString()}
                    <span className="text-lg font-medium text-neutral-500">/month</span>
                </p>
                 <div className="mt-4 space-y-2 border-t pt-4">
                      <div className="flex justify-between items-center text-sm text-neutral-600"><span className="flex items-center gap-2"><ShieldCheck size={16}/>Deposit</span> <span className="font-medium">₹{listing.deposit.toLocaleString()}</span></div>
                      {listing.maintenance && listing.maintenance > 0 && (
                           <div className="flex justify-between items-center text-sm text-neutral-600"><span className="flex items-center gap-2"><Wrench size={16}/>Maintenance</span> <span className="font-medium">₹{listing.maintenance.toLocaleString()}</span></div>
                      )}
                 </div>
              <div className="mt-6 space-y-3 border-t pt-4">
                <p className="font-semibold text-neutral-700">Contact Person: {listing.contact.name}</p>
                <a href={`tel:${listing.contact.phone}`} className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition">
                  <Phone size={20} className="mr-2" /> Call Now
                </a>
                {listing.contact.email && (
                  <a href={`mailto:${listing.contact.email}`} className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition">
                    <Mail size={20} className="mr-2" /> Send Email
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}