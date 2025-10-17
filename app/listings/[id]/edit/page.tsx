// app/listings/[id]/edit/page.tsx
"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import {
  Save,
  Wifi,
  AirVent,
  UtensilsCrossed,
  ParkingCircle,
  Bed,
  Table,
  WashingMachine,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { IListing } from "@/app/types";

const amenityOptions = [
  { key: "wifi", label: "Wi-Fi", icon: <Wifi size={20} /> },
  { key: "ac", label: "A/C", icon: <AirVent size={20} /> },
  { key: "food", label: "Food", icon: <UtensilsCrossed size={20} /> },
  { key: "parking", label: "Parking", icon: <ParkingCircle size={20} /> },
  { key: "bed", label: "Bed", icon: <Bed size={20} /> },
  { key: "table", label: "Table", icon: <Table size={20} /> },
  {
    key: "washingMachine",
    label: "Washing Machine",
    icon: <WashingMachine size={20} />,
  },
] as const;

export default function EditListingPage() {
  const params = useParams();
  const { id } = params;
  const [form, setForm] = useState<IListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchListingData = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch listing data");
        const data = await res.json();
        if (data.success) {
          setForm(data.listing);
        } else {
          alert("Listing not found.");
          router.push("/my-listings");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching listing data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListingData();
  }, [id, router]);

  useEffect(() => {
    if (
      typeof window.google === "undefined" ||
      !mapRef.current ||
      !autocompleteRef.current ||
      !form
    )
      return;

    const initialLocation = {
      lat: form.latitude || 18.5204,
      lng: form.longitude || 73.8567,
    };

    const map = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 16,
    });
    const marker = new google.maps.Marker({
      map,
      draggable: true,
      position: initialLocation,
    });
    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current,
      { fields: ["formatted_address", "geometry"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      const location = place.geometry.location;

      setForm((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          address: place.formatted_address || "",
          latitude: location.lat(),
          longitude: location.lng(),
        };
      });

      map.setCenter(location);
      map.setZoom(16);
      marker.setPosition(location);
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;

      setForm((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          latitude: pos.lat(),
          longitude: pos.lng(),
        };
      });
    });
  }, [form]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  const toggleAmenity = (amenityKey: keyof IListing["amenities"]) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            amenities: {
              ...prev.amenities,
              [amenityKey]: !prev.amenities[amenityKey],
            },
          }
        : null
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Listing updated successfully!");
        router.push(`/my-listings`);
      } else {
        alert(`Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred while updating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <main className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-neutral-200/80">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Edit Listing
        </h1>
        <p className="text-neutral-500 mb-8">
          Update the details for your property below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Spacious 2BHK near PICT"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="listingType"
                className="block text-sm font-medium text-neutral-700"
              >
                Listing Type
              </label>
              <select
                name="listingType"
                id="listingType"
                value={form.listingType}
                onChange={handleChange}
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              >
                <option>PG</option> <option>Flat</option>{" "}
                <option>Hostel</option>
              </select>
            </div>
            {(form.listingType === "PG" || form.listingType === "Hostel") && (
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={form.gender || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
                >
                  <option value="Any">Any</option>{" "}
                  <option value="Male">Male</option>{" "}
                  <option value="Female">Female</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="availableBeds"
              className="block text-sm font-medium text-neutral-700"
            >
              Available Beds
            </label>
            <input
              type="number"
              id="availableBeds"
              name="availableBeds"
              min={0}
              max={form.bedsPerRoom || 0}
              required
              value={form.availableBeds || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        availableBeds: Math.min(val, prev.bedsPerRoom ?? 0),
                      }
                    : null
                );
              }}
              placeholder="Enter number of available beds"
              className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Cannot exceed total beds per room ({form.bedsPerRoom || 0})
            </p>
          </div>

          {/* Address Search & Map Section */}
          <div>
            <label
              htmlFor="address-autocomplete"
              className="block text-sm font-medium text-neutral-700"
            >
              Search Address
            </label>
            <input
              ref={autocompleteRef}
              id="address-autocomplete"
              type="text"
              required
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              value={form.address}
              placeholder="Start typing your property address..."
              className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
            />
            <label className="block text-sm font-medium text-neutral-700 mt-6 mb-2">
              Pin Location on Map (Drag the pin to be precise)
            </label>
            <div ref={mapRef} className="w-full h-80 rounded-lg border" />
          </div>
          {/* Financial & Furnishing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="deposit"
                className="block text-sm font-medium text-neutral-700"
              >
                Deposit (₹)
              </label>
              <input
                type="number"
                name="deposit"
                id="deposit"
                required
                value={form.deposit}
                onChange={handleChange}
                placeholder="e.g., 20000"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="rentPerMonth"
                className="block text-sm font-medium text-neutral-700"
              >
                Rent per Month (₹)
              </label>
              <input
                type="number"
                name="rentPerMonth"
                id="rentPerMonth"
                required
                value={form.rentPerMonth}
                onChange={handleChange}
                placeholder="e.g., 8500"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="maintenance"
                className="block text-sm font-medium text-neutral-700"
              >
                Maintenance (₹)
              </label>
              <input
                type="number"
                name="maintenance"
                id="maintenance"
                value={form.maintenance}
                onChange={handleChange}
                placeholder="e.g., 1500 (optional)"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="electricityBillBy"
                className="block text-sm font-medium text-neutral-700"
              >
                Electricity Bill
              </label>
              <select
                name="electricityBillBy"
                id="electricityBillBy"
                value={form.electricityBillBy}
                onChange={handleChange}
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="Owner">Owner pays</option>
                <option value="Tenant">Tenant pays</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="furnished"
                className="block text-sm font-medium text-neutral-700"
              >
                Furnishing
              </label>
              <select
                name="furnished"
                id="furnished"
                value={form.furnished}
                onChange={handleChange}
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the property, rules, and nearby landmarks..."
              className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Amenities
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenityOptions.map(({ key, label, icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg font-semibold text-sm transition-all duration-200 ${
                    form.amenities[key]
                      ? "bg-teal-50 text-teal-700 border-teal-400 ring-2 ring-teal-200"
                      : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Uploader (Display only, no new uploads in this version) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Current Photos
            </label>
            <div className="mt-2 flex gap-3 flex-wrap">
              {form.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="w-24 h-24 border rounded-lg overflow-hidden relative shadow-sm"
                >
                  <Image
                    src={url}
                    alt="Existing listing photo"
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Note: To update images, please create a new listing.
            </p>
          </div>

          {/* Owner Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-neutral-700"
              >
                Owner Name
              </label>
              <input
                type="text"
                name="name"
                id="contact-name"
                required
                value={form.contact.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="block text-sm font-medium text-neutral-700"
              >
                Owner Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="contact-phone"
                required
                value={form.contact.phone}
                onChange={handleChange}
                placeholder="e.g., +91 9876543210"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-neutral-700"
              >
                Owner Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                id="contact-email"
                value={form.contact.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>

          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 ..."
            >
              <Save size={18} /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
