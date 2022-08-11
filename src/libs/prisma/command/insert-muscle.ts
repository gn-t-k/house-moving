import { Muscle as MuscleInDB } from "@prisma/client";
import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type InsertMuscle = (
  _trainee: Trainee,
  _muscle: Muscle
) => Promise<Result<null>>;
export const insertMuscle: InsertMuscle = async (trainee, muscle) => {
  try {
    const traineeId = trainee.id;
    const muscleData: MuscleInDB = {
      id: muscle.id,
      name: muscle.name,
      traineeId,
    };

    await prisma.muscle.create({
      data: muscleData,
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
