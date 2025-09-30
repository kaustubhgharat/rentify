import { NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

// This is the main function your protected API routes will use
export const getUserIdFromRequest = (request: NextRequest): string | null => {
  try {
    // 1. Get the token from the 'token' cookie
    const token = request.cookies.get('token')?.value || '';

    if (!token) {
      return null;
    }

    // 2. Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. Return the user ID from the token's payload
    return decodedToken.id;

  } catch (error) {
    console.error('JWT verification failed:', (error as Error).message);
    // If verification fails (e.g., token is expired or invalid), return null
    return null;
  }
};