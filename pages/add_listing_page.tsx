"use client";
import { useState } from "react";

export default function AddListing() {
  const [form, setForm] = useState({ title: "", price: "", location: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Listing added! (Later this will save to DB)");
  };

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Add New Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Listing</button>
      </form>
    </main>
  );
}
