// app/new-listing/page.tsx

"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import { Listing } from "@/types"; // Assuming types are in @/types
import { useRouter } from 'next/navigation';

// This interface is only for the form's internal state which includes File objects
interface NewListingFormData
  extends Omit<Listing, "_id" | "imageUrls" | "createdAt"> {
  images: File[];
}

const initialFormState: NewListingFormData = {
  title: "",
  listingType: "Flat",
  gender: "Any",
  address: "",
  deposit: 0,
  rent: 0,
  maintenance: 0,
  furnishing: "Unfurnished",
  description: "",
  amenities: {
    wifi: false,
    ac: false,
    food: false,
    parking: false,
    bed: false,
    table: false,
    washingMachine: false,
  },
  images: [],
  contact: { phone: "", email: "" },
};

export default function NewListingPage() {
  const [form, setForm] = useState<NewListingFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Google Maps refs
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if the Google Maps script is loaded
    if (
      typeof window.google === "undefined" ||
      !mapRef.current ||
      !autocompleteRef.current
    )
      return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 }, // Pune default
      zoom: 12,
    });

    const marker = new window.google.maps.Marker({ map, draggable: true });

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        fields: ["formatted_address", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const location = place.geometry.location;
      setForm((prev) => ({
        ...prev,
        address: place.formatted_address || "",
        latitude: location.lat(),
        longitude: location.lng(),
      }));

      map.setCenter(location);
      map.setZoom(16);
      marker.setPosition(location);
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      // You might want to do reverse geocoding here to update the address
      setForm((prev) => ({
        ...prev,
        latitude: pos.lat(),
        longitude: pos.lng(),
      }));
    });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name in form.amenities) {
      setForm((prev) => ({
        ...prev,
        amenities: { ...prev.amenities, [name]: checked },
      }));
    } else if (name === "phone" || name === "email") {
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else if (["deposit", "rent", "maintenance"].includes(name)) {
      setForm((prev) => ({
    ...prev,
    [name]: value === "" ? "" : Number(value),
  }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setForm((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    // Append all form fields except images
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });

    // Append images
    form.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("/api/roommates", {
        method: "POST",
        body: formData, // Send FormData, not JSON
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Post submitted successfully!");
        setForm(initialFormState);
        router.push(`/roommates`);

      } else {
        alert("Error: " + data.error || "Something went wrong.");
      }
    } catch (err) {
      alert("An unexpected error occurred: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-neutral-200/80">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Create New Listing
        </h1>
        <p className="text-neutral-500 mb-8">
          Share your property details to find the perfect roommate or tenant.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Cozy 2BHK in Kothrud"
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              required
            />
          </div>

          {/* Listing Type & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Listing Type
              </label>
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              >
                <option value="Flat">Flat</option>
                <option value="PG">PG</option>
              </select>
            </div>
            {form.listingType === "PG" && (
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Preferred Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            )}
          </div>

          {/* Address + Map */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Address
            </label>
            <input
              ref={autocompleteRef}
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Start typing address..."
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              required
            />
            <div ref={mapRef} className="w-full h-80 mt-4 rounded-lg border" />
            {form.latitude && form.longitude && (
              <p className="mt-2 text-sm text-neutral-500">
                Lat: {form.latitude.toFixed(5)}, Lng:{" "}
                {form.longitude.toFixed(5)}
              </p>
            )}
          </div>

          {/* Money & Furnishing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Deposit (₹)
              </label>
              <input
                type="number"
                name="deposit"
                value={form.deposit}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Rent per Month (₹)
              </label>
              <input
                type="number"
                name="rent"
                value={form.rent}
                required
                onChange={handleChange}
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Maintenance (₹)
              </label>
              <input
                type="number"
                name="maintenance"
                value={form.maintenance}
                required
                onChange={handleChange}
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Furnishing
            </label>
            <select
              name="furnishing"
              value={form.furnishing}
              required
              onChange={handleChange}
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            >
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Furnished">Furnished</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              required
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {Object.keys(form.amenities).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={form.amenities[key as keyof typeof form.amenities]}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 border-neutral-300 rounded focus:ring-teal-500 transition"
                  />
                  <span className="text-sm text-neutral-900 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.contact.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={form.contact.email}
                required
                onChange={handleChange}
                className="mt-1 block w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <Image
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-transparent shadow-sm text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-105 disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              <UserPlus size={18} />{" "}
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
