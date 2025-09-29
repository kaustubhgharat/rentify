import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Create a response object
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        // ✨ FIX: Set the cookie on the response object to clear it
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Set maxAge to 0 to delete the cookie
            path: '/',
        });

        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
    }
}