import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), 
      path: '/',
    });

    return response;

  } catch (error) {
        console.log(error);

    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}