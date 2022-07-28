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

// FIXME: 割合の合計が100じゃなかった場合をフォームエラーにしたい（現状Resultで返している）
type UseExerciseForm = (_props: {
  defaultValues?: ExerciseField;
  muscles: Muscle[];
  registerExercise: (_exercise: Exercise) => Promise<void>;
}) => {
  register: UseFormReturn<ExerciseField>["register"];
  errors: UseFormReturn<ExerciseField>["formState"]["errors"];
  isValid: boolean;
  targetIdList: string[];
  isLastField: boolean;
  isTargetErrorExist: boolean;
  muscleOptions: Muscle[][];
  isLastMuscleOption: boolean;
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

  const isLastField = useMemo(() => fields.length === 1, [fields.length]);

  const isTargetErrorExist = useMemo(() => {
    if (errors.targets === undefined) {
      return false;
    }

    const isNameErrorExist = errors.targets.some(
      (target) => target.muscleId !== undefined
    );
    const isRatioErrorExist = errors.targets.some(
      (target) => target.ratio !== undefined
    );

    return isNameErrorExist || isRatioErrorExist;
  }, [errors.targets]);

  const targetIdList = useMemo(() => fields.map((field) => field.id), [fields]);

  const muscleOptions: Muscle[][] = useMemo(() => {
    const selectedMuscleIds = fields
      .map((field) => field.muscleId)
      .filter((id) => id !== "");

    return selectedMuscleIds.length === 0
      ? [props.muscles]
      : selectedMuscleIds.reduce(
          (acc: Muscle[][], cur: string) => [
            ...acc,
            acc.slice(-1)[0].filter((muscle) => muscle.id !== cur),
          ],
          [props.muscles]
        );
  }, [fields, props.muscles]);

  const isLastMuscleOption = useMemo(
    () => fields.length === props.muscles.length,
    [fields.length, props.muscles.length]
  );

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

      const exercise = toExercise({
        fieldValue: validExerciseField,
        muscles: props.muscles,
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
    isTargetErrorExist,
    muscleOptions,
    isLastMuscleOption,
    appendTargetField,
    removeTargetField,
    submit,
  };
};

type ToExercise = (_props: {
  fieldValue: ValidExerciseField;
  muscles: Muscle[];
}) => Exercise;
const toExercise: ToExercise = ({ fieldValue, muscles }) => {
  const targets = fieldValue.targets.flatMap((target) => {
    const muscle = muscles.find((muscle) => muscle.id === target.muscleId);

    return muscle === undefined
      ? []
      : [
          {
            muscle,
            ratio: parseInt(target.ratio),
          },
        ];
  });

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
