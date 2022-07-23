import { useCallback, useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ulid } from "ulid";
import { Muscle } from "../muscle/muscle";
import { Exercise } from "./exercise";
import { useForm } from "@/ui/form/use-form";
import { Result } from "@/util/result";

export type ExerciseField = {
  name: string;
  targets: {
    muscleId: string;
    ratio: string;
  }[];
  memo: string;
};

export const defaultValues: ExerciseField = {
  name: "",
  targets: [
    {
      muscleId: "",
      ratio: "",
    },
  ],
  memo: "",
};

type UseExerciseForm = (_props: {
  defaultValues?: ExerciseField;
  getMuscleById: (_id: string) => Promise<Muscle>;
  registerExercise: (_exercise: Exercise) => Promise<void>;
}) => {
  register: UseFormReturn<ExerciseField>["register"];
  errors: UseFormReturn<ExerciseField>["formState"]["errors"];
  isValid: boolean;
  targetIdList: string[];
  isLastField: boolean;
  appendTargetField: () => void;
  removeTargetField: (_index: number) => void;
  submit: () => Promise<Result<null>>;
};
export const useExerciseForm: UseExerciseForm = (props) => {
  const {
    register,
    formState: { isValid, errors },
    control,
    getValues,
    handleSubmit,
  } = useForm<ExerciseField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "all",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "targets",
  });

  // TODO: totalRatioみたいな不可視のフィールド増やす？

  const isLastField = useMemo(() => fields.length === 1, [fields.length]);

  const targetIdList = useMemo(() => fields.map((field) => field.id), [fields]);

  const appendTargetField = useCallback(() => {
    append(defaultValues.targets[0]);
  }, [append]);

  const removeTargetField = useCallback(
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
      const validExerciseField = new ValidExerciseField(fieldValue);

      const exercise = await toExercise({
        fieldValue: validExerciseField,
        getMuscleById: props.getMuscleById,
      });

      await handleSubmit(async () => {
        await props.registerExercise(exercise);
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
    targetIdList,
    isLastField,
    appendTargetField,
    removeTargetField,
    submit,
  };
};

type ToExercise = (_props: {
  fieldValue: ValidExerciseField;
  getMuscleById: (_id: string) => Promise<Muscle>;
}) => Promise<Exercise>;
const toExercise: ToExercise = async ({ fieldValue, getMuscleById }) => {
  const targets = await Promise.all(
    fieldValue.targets.map((target) =>
      (async () => ({
        muscle: await getMuscleById(target.muscleId),
        ratio: parseInt(target.ratio),
      }))()
    )
  );

  return {
    id: ulid(),
    name: fieldValue.name,
    targets,
    memo: fieldValue.memo,
  };
};

class ValidExerciseField {
  public name: ExerciseField["name"];
  public targets: ExerciseField["targets"];
  public memo: ExerciseField["memo"];

  public constructor(props: ExerciseField) {
    const isEveryRatioNumericString = !props.targets.some(
      (target) => !/^[0-9]+$/.test(target.ratio)
    );

    if (!isEveryRatioNumericString) {
      throw new Error("割合に不正な値が設定されています");
    }

    const isRatioValid =
      props.targets
        .map((target) => parseInt(target.ratio))
        .reduce((acc, cur) => acc + cur) === 100;

    if (!isRatioValid) {
      throw new Error("割合の合計値が100%になっていません");
    }

    this.name = props.name;
    this.targets = props.targets;
    this.memo = props.memo;
  }
}
