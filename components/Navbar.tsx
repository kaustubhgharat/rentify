import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/listings">Listings</Link>
      <Link href="/add-listing">Add Listing</Link>
      <Link href="/roommates">Roommates</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
