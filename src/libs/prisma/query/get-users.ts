import { createUserID, User } from "@/features/user/user";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type GetUsers = () => Promise<Result<User[]>>;
export const getUsers: GetUsers = async () => {
  try {
    const [users, bloodTypes] = await Promise.all([
      prisma.user.findMany(),
      prisma.bloodTypesOnUsers.findMany(),
    ]);

    return {
      isSuccess: true,
      data: users.map((user) => ({
        id: createUserID(user.id),
        name: user.name,
        tel: user.tel,
        bloodType:
          bloodTypes.find((bloodType) => bloodType.userId === user.id)
            ?.bloodType ?? null,
      })),
    };
  } catch (error) {
    return {
      isSuccess: false,
      failure: {
        message:
          error instanceof Error ? error.message : "something went wrong.",
      },
    };
  }
};
