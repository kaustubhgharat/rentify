import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the token cookie by setting its value to empty and maxAge to 0
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to a past date
      path: '/',
    });

    return response;

  } catch (error) {
        console.log(error);

    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}