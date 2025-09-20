import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">🏠 Rentify</h1>
      <p className="text-lg text-gray-700 mb-6">
        Find PGs, Flats, Hostels, or Roommates near your college.
      </p>
      <div className="flex gap-4">
        <Link href="/listings" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Browse Listings
        </Link>
        <Link href="/add-listing" className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
          Add Your Listing
        </Link>
      </div>
    </main>
  );
}
