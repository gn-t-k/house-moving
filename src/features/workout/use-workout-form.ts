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
    const fieldValue = getValues();

    try {
      const validFieldValue = new ValidWorkoutField(fieldValue);

      const workout = await toWorkout({
        fieldValue: validFieldValue,
        trainee: props.trainee,
        date: props.date,
        exercises: props.exercises,
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
              : "???????????????????????????????????????",
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

type ToWorkout = (_props: {
  fieldValue: ValidWorkoutField;
  trainee: Trainee;
  date: Date;
  exercises: Exercise[];
}) => Promise<Workout>;
export const toWorkout: ToWorkout = async ({
  fieldValue,
  trainee,
  date,
  exercises,
}) => {
  const records = await Promise.all(
    fieldValue.records.flatMap((record) => {
      const exercise = exercises.find(
        (exercise) => exercise.id === record.exerciseId
      );

      return exercise === undefined
        ? []
        : [
            {
              exercise,
              weight: parseInt(record.weight),
              repetition: parseInt(record.repetition),
            },
          ];
    })
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
      throw new Error("????????????????????????????????????????????????");
    }
    if (!isRepetitionNumericString) {
      throw new Error("????????????????????????????????????????????????");
    }

    const weights = props.records.map((record) => parseInt(record.weight));
    const repetitions = props.records.map((record) =>
      parseInt(record.repetition)
    );

    if (weights.some((weight) => weight < 0)) {
      throw new Error("??????????????????????????????????????????");
    }
    if (repetitions.some((repetition) => repetition < 0)) {
      throw new Error("??????????????????????????????????????????");
    }

    this.records = props.records;
    this.memo = props.memo;
  }
}
