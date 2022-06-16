import { BloodType } from "@prisma/client";
import { createUserID, User, UserID } from "@/features/user/user";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type CreateUser = (user: User) => Promise<Result<UserID>>;
export const createUser: CreateUser = async (user) => {
  const createPrismaUser = async (user: User) =>
    await prisma.user.create({
      data: {
        id: user.id.value,
        name: user.name,
        tel: user.tel,
      },
    });
  const createPrismaBloodTypeOnUser = async (
    user: User & { bloodType: BloodType }
  ) =>
    await prisma.bloodTypesOnUsers.create({
      data: {
        userId: user.id.value,
        bloodType: user.bloodType,
      },
    });

  const isBloodTypeExist = (
    user: User
  ): user is User & { bloodType: BloodType } => user.bloodType !== null;

  try {
    const userID = isBloodTypeExist(user)
      ? await (async () => {
          const [createdUser, _] = await Promise.all([
            createPrismaUser(user),
            createPrismaBloodTypeOnUser(user),
          ]);

          return createdUser.id;
        })()
      : await (async () => {
          const createdUser = await createPrismaUser(user);

          return createdUser.id;
        })();

    return {
      isSuccess: true,
      data: createUserID(userID),
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: {
        message:
          error instanceof Error ? error.message : "something went wrong",
      },
    };
  }
};
