import { Muscle as MuscleInDB } from "@prisma/client";
import { Muscle } from "@/features/muscle/muscle";
import { prisma } from "@/libs/prisma/instance";
import { Result } from "@/util/result";

type GetMuscleByName = (_name: string) => Promise<Result<Muscle | null>>;
export const getMuscleByName: GetMuscleByName = async (name) => {
  try {
    const muscleInDB: MuscleInDB | null = await prisma.muscle.findUnique({
      where: {
        name,
      },
    });

    if (muscleInDB === null) {
      return {
        isSuccess: true,
        data: null,
      };
    }

    const buildMuscleResult = Muscle.build({
      id: muscleInDB.id,
      name: muscleInDB.name,
    });

    if (!buildMuscleResult.isSuccess) {
      throw new Error(buildMuscleResult.error.message);
    }

    return {
      isSuccess: true,
      data: buildMuscleResult.data,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error : new Error("unexpected error"),
    };
  }
};
