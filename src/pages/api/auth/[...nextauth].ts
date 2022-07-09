import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/libs/prisma/instance";

const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

if (!GOOGLE_ID) throw new Error("You must provide GOOGLE_ID env var.");
if (!GOOGLE_SECRET) throw new Error("You must provide GOOGLE_SECRET env var.");

const auth = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
});
export default auth;
