import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import type { DefaultJWT } from "next-auth/jwt";

// ─── Type Augmentation ────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      googleId: string;
    } & DefaultSession["user"];
    backendToken: string;
  }

  interface Profile {
    picture?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    googleId?: string;
    backendToken?: string;
    image?: string;
  }
}

// ─── Auth Config ──────────────────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.googleId = account.providerAccountId;
        token.email = profile.email;
        token.name = profile.name;
        token.image = profile.picture;
        console.log("user creation start");
        const res = await fetch(
          // ✅ removed any
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: profile.email,
              name: profile.name,
              image: profile.picture,
            }),
          },
        );

        const data = await res.json();
        console.log("user created", data);
        token.backendToken = data.token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.googleId = token.googleId ?? "";
      session.backendToken = token.backendToken ?? "";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
