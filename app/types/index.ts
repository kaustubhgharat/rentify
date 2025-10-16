// types/index.ts
import { ObjectId } from "mongodb";

export interface IRoommatePost {
  _id: ObjectId | string; // Can be ObjectId from DB or string
  title: string;
  listingType: "Flat" | "PG";
  bhkType?: string;      // Add this optional field
  bedsPerRoom?: string;  
  gender?: "Male" | "Female" | "Any";
  address: string;
  latitude?: number;
  longitude?: number;
  deposit: number;
  rent: number;
  maintenance: number;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  description: string;
  amenities: {
    wifi: boolean;
    ac: boolean;
    food: boolean;
    parking: boolean;
    bed: boolean;
    table: boolean;
    washingMachine: boolean;
  };
  imageUrls: string[]; // URLs from Cloudinary
  contact: {
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
}

// This type will be used across your frontend pages
export interface IListing {
  _id: string;
  title: string;
  listingType: 'PG' | 'Flat' | 'Hostel';
  bhkType?: string;      // Add this optional field
  bedsPerRoom?: number;  // Add this optional field
  availableBeds?:number;
  gender?: "Male" | "Female" | "Any";
  address: string;
  latitude?: number;
  longitude?: number;
  deposit: number;
  rentPerMonth: number;
  maintenance?: number;
  electricityBillBy?: "Owner" | "Tenant" | "Shared";
  furnished?: "Furnished" | "Semi-furnished" | "Unfurnished";
  description: string;
  amenities: {
    wifi: boolean;
    ac: boolean;
    food: boolean;
    parking: boolean;
    bed: boolean;
    table: boolean;
    washingMachine: boolean;
  };
  imageUrls: string[];
  contact: {
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}