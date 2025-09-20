// app/add-listing/page.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Upload } from 'lucide-react';

// Define an interface for our form state for type safety
interface FormData {
  title: string;
  listingType: 'PG' | 'Flat' | 'Hostel';
  price: string;
  location: string;
  description: string;
  amenities: {
    wifi: boolean;
    ac: boolean;
    food: boolean;
    parking: boolean;
  };
}

export default function AddListing() {
  const [form, setForm] = useState<FormData>({
    title: "",
    listingType: "PG",
    price: "",
    location: "",
    description: "",
    amenities: { wifi: false, ac: false, food: false, parking: false }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      amenities: { ...prevForm.amenities, [name]: checked }
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form); // In a real app, you'd send this data to your backend API
    alert("Listing submitted successfully! Check the console for the form data.");
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Listing</h1>
        <p className="text-gray-500 mb-8">Fill out the details below to list your property or roommate request.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" id="title" required value={form.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            {/* Listing Type */}
            <div>
              <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">Listing Type</label>
              <select name="listingType" id="listingType" value={form.listingType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                <option>PG</option>
                <option>Flat</option>
                <option>Hostel</option>
              </select>
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per month in ₹)</label>
              <input type="number" name="price" id="price" required value={form.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (e.g., Viman Nagar, Pune)</label>
              <input type="text" name="location" id="location" required value={form.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows={4} value={form.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          
          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.keys(form.amenities).map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input id={amenity} name={amenity} type="checkbox" onChange={handleAmenityChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor={amenity} className="ml-2 block text-sm text-gray-900 capitalize">{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Uploader */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Photos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}