import Link from "next/link";

const listings = [
  { id: 1, title: "Hostel near PICT", price: "₹5000/mo", img: "/hostel1.jpg" },
  { id: 2, title: "2 BHK Flat in Kothrud", price: "₹12,000/mo", img: "/flat1.jpg" },
  { id: 3, title: "PG for Boys in Hinjewadi", price: "₹7000/mo", img: "/pg1.jpg" },
];

export default function Listings() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <Link key={item.id} href={`/listings/${item.id}`} className="border rounded-lg shadow hover:shadow-lg">
            <img src={item.img} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="font-bold text-xl">{item.title}</h2>
              <p className="text-gray-600">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
