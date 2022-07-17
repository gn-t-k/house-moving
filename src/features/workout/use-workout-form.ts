import { UseFormReturn } from "react-hook-form";
import { ulid } from "ulid";
import { Workout } from "./workout";
import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";
// import { WorkoutMenu } from "@/features/workout-menu/workout-menu";
import { useForm } from "@/ui/form/use-form";

export type WorkoutField = {
  workoutSets: {
    exerciseId: string;
    weight: string;
    repetition: string;
    memo: string;
  }[];
  memo: string;
};

export const defaultValues: WorkoutField = {
  workoutSets: [
    {
      exerciseId: "",
      weight: "",
      repetition: "",
      memo: "",
    },
  ],
  memo: "",
};

type UseWorkoutForm = (
  _defaultValues?: WorkoutField
) => UseFormReturn<WorkoutField>;
export const useWorkoutForm: UseWorkoutForm = (props) =>
  useForm<WorkoutField>({
    defaultValues: props ?? defaultValues,
    mode: "all",
  });

export const isValidRegisterWorkoutField = (
  fieldValue: WorkoutField
): fieldValue is ValidRegisterWorkoutField => {
  try {
    const _ = new ValidRegisterWorkoutField(fieldValue);

    return true;
  } catch (error) {
    return false;
  }
};

type ToWorkout = (_props: {
  fieldValue: ValidRegisterWorkoutField;
  trainee: Trainee;
  date: Date;
  getExerciseById: (_id: string) => Exercise;
}) => Workout;
export const toWorkout: ToWorkout = ({
  fieldValue,
  trainee,
  date,
  getExerciseById,
}) => ({
  id: ulid(),
  trainee,
  workoutSets: fieldValue.workoutSets.map((workoutSet) => ({
    exercise: getExerciseById(workoutSet.exerciseId),
    weight: parseInt(workoutSet.weight),
    repetition: parseInt(workoutSet.repetition),
    memo: workoutSet.memo,
  })),
  date,
  memo: fieldValue.memo,
});

class ValidRegisterWorkoutField {
  public workoutSets: WorkoutField["workoutSets"];
  public memo: WorkoutField["memo"];

  public constructor(props: WorkoutField) {
    const isWeightNumericString = !props.workoutSets.some((workoutSet) =>
      Number.isNaN(parseInt(workoutSet.weight))
    );
    const isRepetitionNumericString = !props.workoutSets.some((workoutSet) =>
      Number.isNaN(parseInt(workoutSet.repetition))
    );

    if (!isWeightNumericString) {
      throw new Error("重量に不正な値が設定されています");
    }
    if (!isRepetitionNumericString) {
      throw new Error("回数に不正な値が設定されています");
    }

    const weights = props.workoutSets.map((workoutSet) =>
      parseInt(workoutSet.weight)
    );
    const repetitions = props.workoutSets.map((workoutSet) =>
      parseInt(workoutSet.repetition)
    );

    if (weights.some((weight) => weight < 0)) {
      throw new Error("重量に負の値は設定できません");
    }
    if (repetitions.some((repetition) => repetition < 0)) {
      throw new Error("回数に負の値は設定できません");
    }

    this.workoutSets = props.workoutSets;
    this.memo = props.memo;
  }
}
// type FromWorkout = (_props: Workout) => RegisterWorkoutField
// type fromWorkoutMenu: (_props: WorkoutMenu) => RegisterWorkoutField;
