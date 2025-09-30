"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { Save } from "lucide-react";
import { Listing } from "../../../types";
import { useRouter, useParams } from 'next/navigation';
import { Loader } from "lucide-react";

// The form data type, excluding fields that shouldn't be edited directly.
// Note: We are not handling image re-uploads in this form for simplicity.
type EditFormData = Omit<Listing, '_id' | 'imageUrls' | 'createdAt' | 'userId' | 'updatedAt'>;

export default function EditListingPage() {
  // State for the form, initialized to null until data is fetched
  const [form, setForm] = useState<EditFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Get the post ID from the URL

  // Refs for Google Maps
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  // 1. Fetch the existing post data when the component mounts
  useEffect(() => {
    if (!id) return;
    const fetchPostData = async () => {
      try {
        const res = await fetch(`/api/roommates/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch post data. It may have been deleted.");
        }
        const result = await res.json();
        setForm(result.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchPostData();
  }, [id]);

  // 2. Initialize Google Maps once the form data (with lat/lng) is loaded
  useEffect(() => {
    if (!form || typeof window.google === 'undefined' || !mapRef.current || !autocompleteRef.current) {
      return;
    }

    const initialPosition = { lat: form.latitude || 18.5204, lng: form.longitude || 73.8567 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
    });

    const marker = new window.google.maps.Marker({ map, draggable: true, position: initialPosition });

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
      fields: ["formatted_address", "geometry"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      const location = place.geometry.location;
      
      setForm(prevForm => prevForm ? {
        ...prevForm,
        address: place.formatted_address || "",
        latitude: location.lat(),
        longitude: location.lng(),
      } : null);

      map.setCenter(location);
      map.setZoom(16);
      marker.setPosition(location);
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      
      setForm(prevForm => prevForm ? {
        ...prevForm,
        latitude: pos.lat(),
        longitude: pos.lng(),
      } : null);
    });

  }, [form]); // This effect depends on 'form' being loaded

  // 3. Handle changes in any form field
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!form) return;

    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name in form.amenities) {
      setForm({ ...form, amenities: { ...form.amenities, [name]: checked } });
    } else if (name === "name" || name === "phone" || name === "email") {
      setForm({ ...form, contact: { ...form.contact, [name]: value } });
    } else if (["deposit", "rent", "maintenance"].includes(name)) {
      setForm({ ...form, [name]: value === "" ? 0 : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 4. Handle the form submission with a PUT request
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/roommates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for sending auth cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update the post.");
      }

      alert("Post updated successfully!");
      router.push('/my-posts');

    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loading state until the form data is fetched
  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {error ? <p className="text-red-500">{error}</p> : <Loader className="animate-spin h-8 w-8 text-teal-600" />}
      </div>
    );
  }

  return (
    <main className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-neutral-200/80">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Edit Your Listing
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3"
              required
            />
          </div>

          {/* Listing Type & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Listing Type</label>
              <select name="listingType" value={form.listingType} onChange={handleChange} className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3">
                <option value="Flat">Flat</option>
                <option value="PG">PG</option>
              </select>
            </div>
            {form.listingType === "PG" && (
              <div>
                <label className="block text-sm font-medium text-neutral-700">Preferred Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3">
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            )}
          </div>

          {/* Address + Map */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">Address</label>
            <input
              ref={autocompleteRef}
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3"
              required
            />
            <div ref={mapRef} className="w-full h-80 mt-4 rounded-lg border" />
          </div>

          {/* Money & Furnishing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Deposit (₹)</label>
              <input type="number" name="deposit" value={form.deposit} onChange={handleChange} required className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Rent per Month (₹)</label>
              <input type="number" name="rent" value={form.rent} onChange={handleChange} required className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Maintenance (₹)</label>
              <input type="number" name="maintenance" value={form.maintenance} onChange={handleChange} required className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Furnishing</label>
            <select name="furnishing" value={form.furnishing} onChange={handleChange} required className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3">
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Furnished">Furnished</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3"
              required
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {Object.keys(form.amenities).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={form.amenities[key as keyof typeof form.amenities]}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 border-neutral-300 rounded"
                  />
                  <span className="text-sm text-neutral-900 capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Contact Name</label>
                <input type="text" name="name" value={form.contact.name} onChange={handleChange} required className="mt-1 w-full border border-neutral-300 rounded-lg py-2 px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Contact Phone</label>
                <input type="tel" name="phone" value={form.contact.phone} onChange={handleChange} required className="mt-1 w-full border border-neutral-300 rounded-lg py-2 px-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700">Contact Email (Optional)</label>
                <input type="email" name="email" value={form.contact.email || ''} onChange={handleChange} className="mt-1 w-full border border-neutral-300 rounded-lg py-2 px-3" />
              </div>
            </div>
          </div>
          
          <p className="text-sm text-neutral-500">Note: Image re-uploads are not supported on the edit page.</p>

          {/* Submit */}
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border-transparent shadow-sm text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 disabled:bg-neutral-400"
            >
              <Save size={18} />
              {isSubmitting ? "Updating..." : "Update Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}