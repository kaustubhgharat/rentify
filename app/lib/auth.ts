import { NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const getUserIdFromRequest = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get('token')?.value || '';

    if (!token) {
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return decodedToken.id;

  } catch (error) {
    console.error('JWT verification failed:', (error as Error).message);
    return null;
  }
};