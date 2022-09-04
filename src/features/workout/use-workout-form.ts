import { useCallback, useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Record, Workout } from "./workout";
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

const defaultRecordValue: WorkoutField["records"][number] = {
  exerciseId: "",
  weight: "",
  repetition: "",
};
export const defaultValues: WorkoutField = {
  records: [defaultRecordValue],
  memo: "",
};

type UseWorkoutForm = (_props: {
  defaultValues?: WorkoutField;
  trainee: Trainee;
  date: Date;
  exercises: Exercise[];
  registerWorkout: (_workout: Workout) => Promise<void>;
}) => {
  register: UseFormReturn<WorkoutField>["register"];
  errors: UseFormReturn<WorkoutField>["formState"]["errors"];
  isValid: boolean;
  recordIdList: string[];
  exerciseOptions: Exercise[][];
  appendRecordField: () => void;
  removeRecordField: (_index: number) => void;
  canAppendRecordField: boolean;
  canRemoveRecordField: boolean;
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

  const exerciseOptions: Exercise[][] = useMemo(() => {
    const selectedExerciseIds = fields
      .map((field) => field.exerciseId)
      .filter((id) => id !== "");

    return selectedExerciseIds.length === 0
      ? [props.exercises]
      : selectedExerciseIds.reduce(
          (acc: Exercise[][], cur: string) => {
            const prevOptions = acc.slice(-1)[0];

            return prevOptions === undefined
              ? [props.exercises]
              : [...acc, prevOptions.filter((exercise) => exercise.id !== cur)];
          },
          [props.exercises]
        );
  }, [fields, props.exercises]);

  const canAppendRecordField = useMemo(() => {
    const isLastExerciseOption = fields.length === props.exercises.length;

    const isRecordErrorExist = (() => {
      if (errors.records === undefined) {
        return false;
      }

      const isExerciseErrorExist = errors.records.some(
        (record) => record.exerciseId !== undefined
      );
      const isWeightErrorExist = errors.records.some(
        (record) => record.weight !== undefined
      );
      const isRepetitionErrorExist = errors.records.some(
        (record) => record.repetition !== undefined
      );

      return (
        isExerciseErrorExist || isWeightErrorExist || isRepetitionErrorExist
      );
    })();

    return !isLastExerciseOption && !isRecordErrorExist;
  }, [errors.records, fields.length, props.exercises.length]);

  const canRemoveRecordField = useMemo(() => {
    const isLastField = fields.length === 1;

    return !isLastField;
  }, [fields.length]);

  const appendRecordField = useCallback(() => {
    append(defaultRecordValue);
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
    const errorMessages: string[] = [];
    const fieldValue = getValues();

    const records = fieldValue.records.flatMap((record, index) => {
      const exercise = props.exercises.find(
        (exercise) => exercise.id === record.exerciseId
      );
      if (exercise === undefined) {
        errorMessages.push(`「種目${index}」の値が不正です`);

        return [];
      }

      const weight = parseInt(record.weight);
      if (weight === NaN) {
        errorMessages.push(`「種目${index}の重量」の値が不正です`);

        return [];
      }

      const repetition = parseInt(record.repetition);
      if (repetition === NaN) {
        errorMessages.push(`「種目${index}の回数」の値が不正です`);

        return [];
      }

      const buildRecordResult = Record.build({
        exercise,
        weight,
        repetition,
      });
      if (!buildRecordResult.isSuccess) {
        errorMessages.push(buildRecordResult.error.message);

        return [];
      }

      return [buildRecordResult.data];
    });
    const isRecordsErrorExist = fieldValue.records.length !== records.length;
    if (isRecordsErrorExist) {
      return {
        isSuccess: false,
        error: {
          message: errorMessages.join(", "),
        },
      };
    }

    const buildWorkoutResult = Workout.build({
      trainee: props.trainee,
      records,
      date: props.date,
      memo: fieldValue.memo,
    });
    if (!buildWorkoutResult.isSuccess) {
      return {
        isSuccess: false,
        error: buildWorkoutResult.error,
      };
    }

    const workout = buildWorkoutResult.data;

    try {
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
    exerciseOptions,
    appendRecordField,
    removeRecordField,
    canAppendRecordField,
    canRemoveRecordField,
    submit,
  };
};
