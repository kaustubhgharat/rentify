// types/index.ts
import { ObjectId } from "mongodb";

export interface IRoommatePost {
  _id: ObjectId | string; 
  title: string;
  listingType: "Flat" | "PG";
  bhkType?: string;      
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
  imageUrls: string[]; 
  contact: {
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
}

export interface IListing {
  _id: string;
  title: string;
  listingType: 'PG' | 'Flat' | 'Hostel';
  bhkType?: string;     
  bedsPerRoom?: number;  
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