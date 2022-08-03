import { Trainee } from "@/features/trainee/trainee";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type GetTrainee = (_id: string) => Promise<Result<Trainee>>;
export const getTrainee: GetTrainee = async (id) => {
  try {
    const trainee = await prisma.trainee.findUnique({
      where: {
        id,
      },
    });

    if (!trainee) {
      throw new Error("trainee not found");
    }

    return {
      isSuccess: true,
      data: {
        id: trainee.id,
        name: trainee.name,
        image: trainee.image,
      },
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error : new Error("unexpected error"),
    };
  }
};
