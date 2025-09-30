import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Listing from '@/models/Listing';
import connectDB from "@/lib/mongoose";
import { cookies } from 'next/headers'; // Import cookies
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a file to Cloudinary (this function does not change)
const uploadToCloudinary = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = file.stream().getReader();
        const chunks: Buffer[] = [];

        const read = () => {
            reader.read().then(({ done, value }) => {
                if (done) {
                    const buffer = Buffer.concat(chunks);
                    cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "roommate_listings" },
                        (error, result) => {
                            if (error) reject(error);
                            else if (result) resolve(result.secure_url);
                        }
                    ).end(buffer);
                    return;
                }
                chunks.push(Buffer.from(value));
                read();
            }).catch(reject);
        };
        read();
    });
};

// GET all listings
export async function GET() {
  try {
    await connectDB();
    const listings = await Listing.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: 'Server error fetching listings.' }, { status: 500 });
  }
}

// POST a new listing
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    
    // Only owners can create listings
    if (decodedToken.role !== 'owner') {
        return NextResponse.json({ success: false, error: "Only owners can create listings." }, { status: 403 });
    }
    const ownerId = decodedToken.id;

    const formData = await request.formData();
    const images = formData.getAll("images") as File[];

    if (images.length === 0) {
      return NextResponse.json({ success: false, error: "At least one image is required." }, { status: 400 });
    }

    const imageUrls = await Promise.all(images.map(uploadToCloudinary));
    
    const listingData = {
      owner: ownerId,
      title: formData.get('title'),
      listingType: formData.get('listingType'),
      gender: formData.get('gender'),
      bhkType: formData.get('bhkType'),
      bedsPerRoom: formData.get('bedsPerRoom'),
      address: formData.get('address'),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      deposit: Number(formData.get('deposit')),
      rentPerMonth: Number(formData.get('rentPerMonth')),
      maintenance: Number(formData.get('maintenance')),
      electricityBillBy: formData.get('electricityBillBy'),
      furnished: formData.get('furnished'),
      description: formData.get('description'),
      amenities: JSON.parse(formData.get('amenities') as string),
      contact: JSON.parse(formData.get('contact') as string),
      imageUrls: imageUrls,
    };
    
    const newListing = await Listing.create(listingData);
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: `Failed to create listing: ${errorMessage}` }, { status: 500 });
  }
}