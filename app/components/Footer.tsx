"use client";

import Link from "next/link";
import { Mail, Phone, Twitter, Instagram, Facebook, Heart, Building } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"; // Import the auth hook

export default function Footer() {
  const { user, isAuthenticated } = useAuth(); // Get user session data

  return (
    <footer className="bg-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              Rentify
            </h2>
            <p className="text-sm">
              Your trusted partner for finding student housing in Pune. Simple, safe, and built for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/listings" className="hover:text-teal-400 transition-all transform hover:translate-x-1 block">Find a Room</Link></li>
              <li><Link href="/roommates" className="hover:text-teal-400 transition-all transform hover:translate-x-1 block">Find Roommates</Link></li>
              {/* ✨ Show "Add Listing" only to authenticated owners */}
              {isAuthenticated && user?.role === 'owner' && (
                  <li>
                    <Link href="/listings/add" className="flex items-center gap-2 hover:text-teal-400 transition-all transform hover:translate-x-1">
                        <Building size={16}/> Add Listing
                    </Link>
                  </li>
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="hover:text-teal-400 transition-all transform hover:translate-x-1 block">About Us</Link></li>
              <li><Link href="/" className="hover:text-teal-400 transition-all transform hover:translate-x-1 block">Contact</Link></li>
              <li><Link href="/" className="hover:text-teal-400 transition-all transform hover:translate-x-1 block">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-3 flex-shrink-0" />
                <span>contact@rentify.pune</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-3 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            {/* ✨ Stylized social media icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-teal-600 hover:text-white transition-colors"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          <p className="text-base text-slate-500">
            &copy; {new Date().getFullYear()} Rentify. All rights reserved. Made for Pune students with <Heart size={14} className="inline-block text-red-500 fill-current mx-1" />.
          </p>
        </div>
      </div>
    </footer>
  );
}