import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// This object contains all your NextAuth.js configurations.
export const authOptions: NextAuthOptions = {
  providers: [
    // This example uses Google. Ensure your provider is configured.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  //
  // ✨ CRITICAL: This callbacks section adds the user ID to the session.
  // This is the most likely source of your error.
  //
  callbacks: {
    // This callback runs when a JWT is created (e.g., at sign-in).
    async jwt({ token, user }) {
      // If the 'user' object exists, it means this is the initial sign-in.
      // We add the user's ID from the database to the token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This callback runs when a session is checked.
    async session({ session, token }) {
      // We take the user ID from the token and add it to the session object.
      // This makes it available to the client-side `useSession` hook.
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // A secret is required for signing tokens.
  secret: process.env.NEXTAUTH_SECRET,
};

