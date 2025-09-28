// components/Navbar.tsx (or your file location)

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, BedDouble, Users,  } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

// Helper for nav links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
        ${isActive 
          ? "bg-teal-50 text-teal-600 font-semibold" 
          : "text-neutral-700 hover:bg-neutral-100 hover:text-teal-600"
        }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
        { href: "/listings/add", label: "Add Listing", icon: <Users size={18} /> },
    { href: "/listings", label: "Find Room", icon: <BedDouble size={18} /> },
    { href: "/roommates", label: "Roommates", icon: <Users size={18} /> },
    { href: "/favorites", label: "Favorites", icon: <Users size={18} /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition duration-300">
              Rentify
            </Link>
          </div>
          {/* Desktop Nav */}
          <SignedIn>
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div></SignedIn>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-600 hover:bg-teal-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
          <SignedIn>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-teal-600"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}</SignedIn>
          {/* Mobile Action Buttons */}
          <div className="pt-4 mt-4 border-t border-neutral-200 space-y-2">
            
            <div className="hidden md:flex items-center space-x-4">
            
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
}