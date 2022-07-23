import { useCallback, useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ulid } from "ulid";
import { Workout } from "./workout";
import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";
import { useForm } from "@/ui/form/use-form";
import { Result } from "@/util/result";

export type WorkoutField = {
  records: {
    exerciseId: string;
    weight: string;
    repetition: string;
  }[];
  memo: string;
};

export const defaultValues: WorkoutField = {
  records: [
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
  isValid: boolean;
  recordIdList: string[];
  isLastField: boolean;
  appendRecordField: () => void;
  removeRecordField: (_index: number) => void;
  submit: () => Promise<Result<null>>;
};
export const useWorkoutForm: UseWorkoutForm = (props) => {
  const {
    register,
    formState: { isValid, errors },
    control,
    getValues,
    handleSubmit,
  } = useForm<WorkoutField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "all",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "records",
  });

  const isLastField = useMemo(() => fields.length === 1, [fields.length]);

  const recordIdList = useMemo(() => fields.map((field) => field.id), [fields]);

  const appendRecordField = useCallback(() => {
    append(defaultValues.records[0]);
  }, [append]);

  const removeRecordField = useCallback(
    (index: number) => {
      if (isLastField) {
        return;
      }

      remove(index);
    },
    [isLastField, remove]
  );

  const submit = useCallback(async (): Promise<Result<null>> => {
    const fieldValue = getValues();

    try {
      const validFieldValue = new ValidWorkoutField(fieldValue);

      const workout = await toWorkout({
        fieldValue: validFieldValue,
        trainee: props.trainee,
        date: props.date,
        getExerciseById: props.getExerciseById,
      });

      await handleSubmit(async () => {
        await props.registerWorkout(workout);
      })();

      return {
        isSuccess: true,
        data: null,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました",
        },
      };
    }
  }, [getValues, handleSubmit, props]);

  return {
    register,
    errors,
    isValid,
    recordIdList,
    isLastField,
    appendRecordField,
    removeRecordField,
    submit,
  };
};

type ToWorkout = (_props: {
  fieldValue: ValidWorkoutField;
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
  const records = await Promise.all(
    fieldValue.records.map((record) =>
      (async () => ({
        exercise: await getExerciseById(record.exerciseId),
        weight: parseInt(record.weight),
        repetition: parseInt(record.repetition),
      }))()
    )
  );

  return {
    id: ulid(),
    trainee,
    records,
    date,
    memo: fieldValue.memo,
  };
};

class ValidWorkoutField {
  public records: WorkoutField["records"];
  public memo: WorkoutField["memo"];

  public constructor(props: WorkoutField) {
    const isWeightNumericString = !props.records.some(
      (record) => !/^[0-9]+$/.test(record.weight)
    );
    const isRepetitionNumericString = !props.records.some(
      (record) => !/^[0-9]+$/.test(record.repetition)
    );

    if (!isWeightNumericString) {
      throw new Error("重量に不正な値が設定されています");
    }
    if (!isRepetitionNumericString) {
      throw new Error("回数に不正な値が設定されています");
    }

    const weights = props.records.map((record) => parseInt(record.weight));
    const repetitions = props.records.map((record) =>
      parseInt(record.repetition)
    );

    if (weights.some((weight) => weight < 0)) {
      throw new Error("重量に負の値は設定できません");
    }
    if (repetitions.some((repetition) => repetition < 0)) {
      throw new Error("回数に負の値は設定できません");
    }

    this.records = props.records;
    this.memo = props.memo;
  }
}
