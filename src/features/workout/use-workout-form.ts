import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ulid } from "ulid";
import { Workout } from "./workout";
import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";
// import { WorkoutMenu } from "@/features/workout-menu/workout-menu";
import { useForm } from "@/ui/form/use-form";
import { Result } from "@/util/result";

export type WorkoutField = {
  workoutSets: {
    exerciseId: string;
    weight: string;
    repetition: string;
  }[];
  memo: string;
};

export const defaultValues: WorkoutField = {
  workoutSets: [
    {
      exerciseId: "",
      weight: "",
      repetition: "",
    },
  ],
  memo: "",
};

type UseWorkoutForm = (_props: {
  defaultValues?: WorkoutField;
  trainee: Trainee;
  date: Date;
  getExerciseById: (_id: string) => Promise<Exercise>;
  registerWorkout: (_workout: Workout) => Promise<void>;
}) => {
  /**
   * memo:
   * react-hook-formの型をhooksに隠蔽してしまってもよいが、
   * そうするとJSXがかなり読みにくくなってしまうため、あえてそのまま露出させている
   */
  register: UseFormReturn<WorkoutField>["register"];
  errors: UseFormReturn<WorkoutField>["formState"]["errors"];
  workoutSetIdList: string[];
  isLastField: boolean;
  appendWorkoutSetField: () => void;
  removeWorkoutSetField: (_index: number) => void;
  handleSubmit: () => Promise<Result<null>>;
};
export const useWorkoutForm: UseWorkoutForm = (props) => {
  const form = useForm<WorkoutField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workoutSets",
  });

  const isLastField = fields.length === 1;

  const workoutSetIdList = fields.map((field) => field.id);

  const appendWorkoutSetField = () => {
    append(defaultValues.workoutSets);
  };

  const removeWorkoutSetField = (index: number) => {
    if (isLastField) {
      return;
    }

    remove(index);
  };

  const handleSubmit = async (): Promise<Result<null>> => {
    const fieldValue = form.getValues();

    try {
      const validFieldValue = new ValidRegisterWorkoutField(fieldValue);

      const workout = await toWorkout({
        fieldValue: validFieldValue,
        trainee: props.trainee,
        date: props.date,
        getExerciseById: props.getExerciseById,
      });

      await props.registerWorkout(workout);

      return {
        isSuccess: true,
        data: null,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: {
          message: error instanceof Error ? error.message : "internal error",
        },
      };
    }
  };

  return {
    register: form.register,
    errors: form.formState.errors,
    workoutSetIdList,
    isLastField,
    appendWorkoutSetField,
    removeWorkoutSetField,
    handleSubmit,
  };
};

type ToWorkout = (_props: {
  fieldValue: ValidRegisterWorkoutField;
  trainee: Trainee;
  date: Date;
  getExerciseById: (_id: string) => Promise<Exercise>;
}) => Promise<Workout>;
export const toWorkout: ToWorkout = async ({
  fieldValue,
  trainee,
  date,
  getExerciseById,
}) => {
  const workoutSets = await Promise.all(
    fieldValue.workoutSets.map((workoutSet) =>
      (async () => ({
        exercise: await getExerciseById(workoutSet.exerciseId),
        weight: parseInt(workoutSet.weight),
        repetition: parseInt(workoutSet.repetition),
      }))()
    )
  );

  return {
    id: ulid(),
    trainee,
    workoutSets,
    date,
    memo: fieldValue.memo,
  };
};

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
