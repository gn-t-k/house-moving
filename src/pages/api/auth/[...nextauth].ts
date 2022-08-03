import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Trainee } from "@/features/trainee/trainee";
import { insertTrainee } from "@/libs/prisma/command/insert-trainee";
import { prisma } from "@/libs/prisma/instance";
import { getTrainee } from "@/libs/prisma/query/get-trainee";

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
    signIn: async ({ user }) => {
      const isValidUser = (
        value: unknown
      ): value is Required<{ // userのプロパティからundefinedとnullを除いた型
        [Key in keyof typeof user]: NonNullable<typeof user[Key]>;
      }> => {
        const maybeUser = value as typeof user;

        return !!maybeUser.name && !!maybeUser.email && !!maybeUser.image;
      };

      if (!isValidUser(user)) {
        return false;
      }

      const getTraineeResult = await getTrainee(user.id);

      const isTraineeExist = getTraineeResult.isSuccess;

      if (!isTraineeExist) {
        const trainee: Trainee = {
          id: user.id,
          name: user.name,
          image: user.image,
        };

        const insertTraineeResult = await insertTrainee(trainee);

        return insertTraineeResult.isSuccess;
      }

      return true;
    },
  },
});
export default auth;
