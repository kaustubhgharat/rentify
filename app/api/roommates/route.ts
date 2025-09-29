import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Roommate from '@/models/roommate'; // ✨ Import the Mongoose model
import connectDB from "@/lib/mongoose";   // ✨ Import the Mongoose connection utility


export const dynamic = 'force-dynamic';

// Configure Cloudinary (same as before)
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

// GET handler - Now using the Mongoose model
export async function GET() {
  try {
    await connectDB();

    const roommates = await Roommate.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, listings: roommates });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings." },
      { status: 500 }
    );
  }
}


// POST handler - Now using Mongoose for validation and saving
export async function POST(request: NextRequest) {
  await connectDB(); // Ensure DB connection

  try {
    const formData = await request.formData();
    const images = formData.getAll("images") as File[];

    if (images.length === 0) {
        return NextResponse.json({ success: false, error: "At least one image is required." }, { status: 400 });
    }

    const imageUrls = await Promise.all(images.map(uploadToCloudinary));

    const newRoommateData = {
        title: formData.get('title'),
        listingType: formData.get('listingType'),
        address: formData.get('address'),
        latitude: Number(formData.get('latitude')),
        longitude: Number(formData.get('longitude')),
        deposit: Number(formData.get('deposit')),
        rent: Number(formData.get('rent')),
        maintenance: Number(formData.get('maintenance')),
        furnishing: formData.get('furnishing'),
        description: formData.get('description'),
        gender: formData.get('gender'),
        amenities: JSON.parse(formData.get('amenities') as string),
        contact: JSON.parse(formData.get('contact') as string),
        imageUrls: imageUrls,
        // ✨ FIX 2: Read the 'createdBy' field from the form data
        createdBy: formData.get('createdBy'),
    };

    // ✨ Create new listing. Mongoose automatically validates the data against your schema!
    const roommate = await Roommate.create(newRoommateData);

    return NextResponse.json({ success: true, roommate }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Failed to create listing: ${errorMessage}` },
      { status: 500 }
    );
  }
}