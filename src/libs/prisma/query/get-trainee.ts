import { Trainee as TraineeInDB } from "@prisma/client";
import { Trainee } from "@/features/trainee/trainee";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type GetTrainee = (_id: string) => Promise<Result<Trainee>>;
export const getTrainee: GetTrainee = async (id) => {
  try {
    const traineeInDB: TraineeInDB | null = await prisma.trainee.findUnique({
      where: {
        id,
      },
    });

    if (!traineeInDB) {
      throw new Error("trainee not found");
    }

    const buildTraineeResult = Trainee.reconstruct({
      id: traineeInDB.id,
      name: traineeInDB.name,
      image: traineeInDB.image,
    });
    if (!buildTraineeResult.isSuccess) {
      throw new Error(buildTraineeResult.error.message);
    }

    const trainee = buildTraineeResult.data;

    return {
      isSuccess: true,
      data: trainee,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error : new Error("unexpected error"),
    };
  }
};
