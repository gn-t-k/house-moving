import { Trainee as TraineeInDB } from "@prisma/client";
import { Trainee } from "@/features/trainee/trainee";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type InsertTrainee = (_trainee: Trainee) => Promise<Result<null>>;
export const insertTrainee: InsertTrainee = async (trainee) => {
  try {
    const traineeData: TraineeInDB = {
      id: trainee.id,
      name: trainee.name,
      image: trainee.image,
    };

    await prisma.trainee.create({
      data: traineeData,
    });

    return {
      isSuccess: true,
      data: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error : new Error("unexpected error"),
    };
  }
};
