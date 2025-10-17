import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Roommate from "@/app/models/Roommate";
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getUserIdFromToken = async (request: NextRequest): Promise<string | null> => {
  try {
    const cookieStore = await cookies(); // async call
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function uploadImagesToCloudinary(images: File[]): Promise<string[]> {
  const uploadPromises = images.map(async (image) => {

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(buffer);
    });
  });

  return Promise.all(uploadPromises);
}


export async function GET() {
  try {
    await dbConnect();
    const listings = await Roommate.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, listings: listings });

  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request); // ✅ await here
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    
    if (images.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one image is required.' }, { status: 400 });
    }
    const imageUrls = await uploadImagesToCloudinary(images);
    const newRoommateData = {
      title: formData.get('title'),
      listingType: formData.get('listingType'),
      gender: formData.get('gender'),
      address: formData.get('address'),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      deposit: Number(formData.get('deposit')),
      rent: Number(formData.get('rent')),
      maintenance: Number(formData.get('maintenance')),
      furnishing: formData.get('furnishing'),
      description: formData.get('description'),
      amenities: JSON.parse(formData.get('amenities') as string),
      contact: JSON.parse(formData.get('contact') as string),
      imageUrls: imageUrls,
      userId: userId, 
    };

    const roommate = await Roommate.create(newRoommateData);

    return NextResponse.json({ success: true, data: roommate }, { status: 201 });

  }catch (error) { 
    console.error(error);
    let errorMessage = 'Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
