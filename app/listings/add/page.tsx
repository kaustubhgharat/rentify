// app/listings/add/page.tsx

"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import {
  Send,
  Upload,
  Wifi,
  AirVent,
  UtensilsCrossed,
  ParkingCircle,
  Bed,
  Table,
  WashingMachine,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

// ✨ State now includes bhkType and bedsPerRoom
const initialFormState = {
  title: "",
  listingType: "PG" as "PG" | "Flat" | "Hostel",
  gender: "Any" as "Male" | "Female" | "Any",
  bhkType: "1 BHK", // Default value for Flat
  bedsPerRoom: 2,
  availableBeds: 2,
  address: "",
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  deposit: "",
  rentPerMonth: "",
  maintenance: "",
  electricityBillBy: "Owner" as "Owner" | "Tenant" | "Shared",
  furnished: "Unfurnished" as "Furnished" | "Semi-furnished" | "Unfurnished",
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
  images: [] as File[],
  contact: {
    name: "",
    phone: "",
    email: "",
  },
};

export default function AddListingPage() {
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  // ✨ REVISED: This useEffect is now safe for React Strict Mode
  useEffect(() => {
    const scriptId = "google-maps-script";

    // 1. Check if the script tag already exists in the document
    const existingScript = document.getElementById(scriptId);

    // Also check if window.google is already available
    if (window.google) {
      setIsApiLoaded(true);
      return;
    }

    // If the script already exists but window.google isn't ready, we wait.
    // The `onload` event on the existing script will handle setting the state.
    if (existingScript) {
      return;
    }

    // 2. If it doesn't exist, create and append it
    const script = document.createElement("script");
    script.id = scriptId; // Add an ID to easily find it later
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places,marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsApiLoaded(true);
    script.onerror = () => console.error("Google Maps script failed to load.");

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (
      !isApiLoaded ||
      typeof window.google === "undefined" ||
      !mapRef.current ||
      !autocompleteRef.current
    )
      return;

    const AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 },
      zoom: 12,
      mapId: "YOUR_MAP_ID",
    });

    const marker = new AdvancedMarkerElement({
      map: map,
      position: { lat: 18.5204, lng: 73.8567 },
      gmpDraggable: true,
    });

    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        fields: ["formatted_address", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      setForm((prev) => ({
        ...prev,
        address: place.formatted_address || "",
        latitude: lat,
        longitude: lng,
      }));

      map.setCenter(location);
      map.setZoom(16);
      marker.position = { lat, lng }; // Update marker's position property
    });

    // Note: the event name is "gmp-dragend"
    marker.addListener("gmp-dragend", () => {
      const pos = marker.position as google.maps.LatLng; // The position will be a LatLng object
      if (!pos) return;
      setForm((prev) => ({
        ...prev,
        latitude: pos.lat(),
        longitude: pos.lng(),
      }));
    });
  }, [isApiLoaded]);

  // ✨ Simplified handler for both top-level and nested contact fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bedsPerRoom") {
      const numericValue = value === "5+" ? 5 : Number(value); // Convert to number
      setForm((prev) => ({
        ...prev,
        bedsPerRoom: numericValue,
        availableBeds: Math.min(
          prev.availableBeds || numericValue,
          numericValue
        ),
      }));
    } else if (name === "availableBeds") {
      setForm((prev) => ({
        ...prev,
        availableBeds: Number(value),
      }));
    } else if (["name", "phone", "email"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleAmenity = (
    amenityKey: keyof typeof initialFormState.amenities
  ) => {
    setForm((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityKey]: !prev.amenities[amenityKey],
      },
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));
  };

  // ✨ Fully implemented submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    // Loop through form state and append to formData
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        form.images.forEach((file) => formData.append("images", file));
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Listing published successfully!");
        router.push(`/listings/${data.listing._id}`);
      } else {
        alert(`Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-neutral-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-neutral-200/80">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Create a New Listing
        </h1>
        <p className="text-neutral-500 mb-8">
          Fill out the details below to list your property on Rentify.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
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

            {/* === CONDITIONAL INPUT FOR FLATS === */}
            {form.listingType === "Flat" && (
              <div>
                <label
                  htmlFor="bhkType"
                  className="block text-sm font-medium text-neutral-700"
                >
                  BHK Type
                </label>
                <select
                  name="bhkType"
                  id="bhkType"
                  value={form.bhkType}
                  onChange={handleChange}
                  className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
                >
                  <option>1 RK</option>
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                  <option>4 BHK</option>
                  <option>4+ BHK</option>
                </select>
              </div>
            )}

            {/* === CONDITIONAL INPUT FOR PG / HOSTEL === */}
            {(form.listingType === "PG" || form.listingType === "Hostel") && (
              <>
                <div>
                  <label
                    htmlFor="bedsPerRoom"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Beds per Room
                  </label>
                  <select
                    name="bedsPerRoom"
                    id="bedsPerRoom"
                    value={form.bedsPerRoom}
                    onChange={handleChange}
                    className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
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
              </>
            )}
          </div>
          {(form.listingType === "PG" || form.listingType === "Hostel") && (
            <div>
              <label
                htmlFor="availableBeds"
                className="block text-sm font-medium text-neutral-700"
              >
                Available Beds
              </label>
              <input
                type="number"
                name="availableBeds"
                id="availableBeds"
                min={1}
                max={form.bedsPerRoom}
                value={form.availableBeds || form.bedsPerRoom}
                onChange={handleChange}
                className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          )}

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
          {/* Photo Uploader */}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Upload Photos
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                <div className="flex text-sm text-neutral-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap">
              {form.images.map((file, i) => (
                <div
                  key={i}
                  className="w-24 h-24 border rounded-lg overflow-hidden relative shadow-sm"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
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
          {/* Submit Button */}
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-transparent shadow-sm text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed"
            >
              <Send size={18} />{" "}
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
