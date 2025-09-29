import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import your configuration

// This creates the API handler by passing your options to NextAuth.
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests.
export { handler as GET, handler as POST };
