// app/about/page.tsx

import { ShieldCheck, User, Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const features = [
    {
      icon: <User className="h-10 w-10 text-blue-600" />,
      title: "Student Focused",
      description: "Every feature is designed with the needs of college students in Pune in mind—from budgets to proximity to campuses."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
      title: "Safe & Verified",
      description: "We encourage verified listings and provide tips for safe renting to ensure you have a secure housing experience."
    },
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "Simple to Use",
      description: "Our clean interface and powerful filters make finding the perfect PG, flat, or roommate faster than ever."
    },
    {
      icon: <Home className="h-10 w-10 text-blue-600" />,
      title: "Local to Pune",
      description: "As a platform focused solely on Pune, we provide hyperlocal insights and the most relevant local listings."
    }
  ];

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Our Mission: Simplify Student Housing
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Rentify was born from a simple idea: finding a place to live while in college shouldnot be a hassle. We are a platform built by students, for students, to make finding PGs, flats, and roommates near your Pune campus easy, safe, and transparent.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Why Choose Rentify?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Better Way to Find Your Home
            </p>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 bg-white rounded-lg shadow-md text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to find your place?
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Start browsing hundreds of listings or find your next roommate today.
          </p>
          <Link href="/listings" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
            Browse Listings
          </Link>
        </div>
      </div>
    </main>
  );
}