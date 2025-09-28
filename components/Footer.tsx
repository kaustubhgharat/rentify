// components/Footer.tsx (or your file location)

import Link from "next/link";
import { Mail, Phone, Twitter, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Rentify</h2>
            <p className="text-slate-400">
              Your trusted partner for finding student housing in Katraj. Simple, safe, and built for you.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/listings" className="hover:text-teal-300 transition-colors">Listings</Link></li>
              <li><Link href="/roommates" className="hover:text-teal-300 transition-colors">Find a Roommate</Link></li>
              <li><Link href="/add-listing" className="hover:text-teal-300 transition-colors">Add a Listing</Link></li>
            </ul>
          </div>
          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="hover:text-teal-300 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-teal-300 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-teal-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0 text-slate-400" />
                <span>contact@rentify.pune</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0 text-slate-400" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors"><Twitter /></a>
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors"><Facebook /></a>
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors"><Instagram /></a>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-base text-slate-400">
            &copy; {new Date().getFullYear()} Rentify. All rights reserved. Made for Pune students with <span role="img" aria-label="heart">❤️</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}