export default function ListingDetail({ params }: { params: { id: string } }) {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Listing #{params.id}</h1>
      <img src="/hostel1.jpg" alt="hostel" className="my-4 rounded-lg w-full max-w-lg" />
      <p className="text-gray-700">📍 Location: Pune, near PICT</p>
      <p className="text-gray-700">💰 Price: ₹5000/month</p>
      <p className="text-gray-700">📞 Contact: 9876543210</p>
      <iframe
        className="mt-4 w-full h-60 rounded-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12..."
        loading="lazy"
      ></iframe>
    </main>
  );
}
