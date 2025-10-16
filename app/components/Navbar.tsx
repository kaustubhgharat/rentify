"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode; }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-teal-50 text-teal-600 font-semibold" : "text-neutral-700 hover:bg-neutral-100 hover:text-teal-600"}`}>
      {children}
    </Link>
  );
};

const NavLinksSkeleton = () => (
  <>
    <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse" />
    <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
    <div className="h-6 w-28 bg-gray-200 rounded-md animate-pulse" />
  </>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();

  // *** REMOVED ***
  // The localStorage listener is no longer needed. The component will automatically
  // re-render whenever the `user` object in AuthContext changes.

  const allNavLinks = [
    { href: "/listings", label: "Find Room", roles: ["student", "owner"] },
    { href: "/listings/add", label: "Add Listing", roles: ["owner"] },
    { href: "/my-listings", label: "My Listings", roles: ["owner"] },
    { href: "/roommates", label: "Roommates", roles: ["student"] },
    { href: "/my-posts", label: "My Posts", roles: ["student"] },
    { href: "/favorites", label: "Favorites", roles: ["student"] },
  ];

  const visibleLinks =
    !loading && isAuthenticated
      ? allNavLinks.filter((link) => link.roles.includes(user!.role))
      : [];

  return (
    <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            Rentify
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <NavLinksSkeleton />
            ) : (
              visibleLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                <Link
                  href={`/profile`}
                  className="flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:text-teal-600"
                >
                  {user.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profilePhotoUrl}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-teal-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold uppercase border-2 border-teal-500">
                      {user.username?.charAt(0)}
                    </div>
                  )}
                  <span>Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-teal-600">
                  Sign In
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-full hover:bg-teal-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-teal-600 hover:bg-teal-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t">
          {loading ? (
            <div className="p-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ) : (
            visibleLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium">
                {link.label}
              </Link>
            ))
          )}
          <div className="pt-4 mt-4 border-t border-neutral-200">
            {loading ? (
              <div className="p-3">
                <div className="h-8 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <Link href="/signin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
