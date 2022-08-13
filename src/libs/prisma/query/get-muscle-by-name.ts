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

    return {
      isSuccess: true,
      data:
        muscleInDB === null
          ? null
          : new Muscle({
              id: muscleInDB.id,
              name: muscleInDB.name,
            }),
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error : new Error("unexpected error"),
    };
  }
};
