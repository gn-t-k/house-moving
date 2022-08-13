import { useCallback, useEffect, useMemo } from "react";
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
  totalRatio: null;
  memo: string;
};

const defaultTargetValues: ExerciseField["targets"][number] = {
  muscleId: "",
  ratio: "",
};
export const defaultValues: ExerciseField = {
  name: "",
  targets: [defaultTargetValues],
  totalRatio: null,
  memo: "",
};

type UseExerciseForm = (_props: {
  defaultValues?: ExerciseField;
  muscles: Muscle[];
  registerExercise: (_exercise: Exercise) => Promise<void>;
  isSameNameExerciseExist: (_exercise: Exercise) => Promise<boolean>;
}) => {
  register: UseFormReturn<ExerciseField>["register"];
  errors: UseFormReturn<ExerciseField>["formState"]["errors"];
  isValid: boolean;
  muscleOptions: Muscle[][];
  targetIdList: string[];
  appendTargetField: () => void;
  removeTargetField: (_index: number) => void;
  canAppendTargetField: boolean;
  canRemoveTargetField: boolean;
  submit: () => Promise<Result<null>>;
};
export const useExerciseForm: UseExerciseForm = (props) => {
  const {
    register,
    formState: { isValid, errors, touchedFields },
    control,
    getValues,
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm<ExerciseField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "targets",
  });
  const targets = watch("targets");

  const isRatio100 = (() => {
    const ratioStrings = targets.map((target) => target.ratio);

    if (ratioStrings.some((ratio) => !/^[0-9]+$/.test(ratio))) {
      return false;
    }

    const ratios = ratioStrings.map((ratioString) => parseInt(ratioString));

    return ratios.reduce((acc, cur) => acc + cur) === 100;
  })();

  useEffect(() => {
    if (touchedFields.targets === undefined) {
      return;
    }

    if (!isRatio100) {
      setError("totalRatio", {
        message:
          "種目における部位の割合の合計値が100になるように入力してください",
      });
    } else {
      clearErrors("totalRatio");
    }
  }, [clearErrors, isRatio100, setError, touchedFields.targets]);

  const canRemoveTargetField = useMemo(() => {
    const isLastField = fields.length === 1;

    return isLastField;
  }, [fields.length]);

  const targetIdList = useMemo(() => fields.map((field) => field.id), [fields]);

  const muscleOptions: Muscle[][] = useMemo(() => {
    const selectedMuscleIds = fields
      .map((field) => field.muscleId)
      .filter((id) => id !== defaultTargetValues.muscleId);

    return selectedMuscleIds.length === 0
      ? [props.muscles]
      : selectedMuscleIds.reduce(
          (acc: Muscle[][], cur: string) => {
            const prevOptions = acc.slice(-1)[0];

            return prevOptions === undefined
              ? [props.muscles]
              : [...acc, prevOptions.filter((muscle) => muscle.id !== cur)];
          },
          [props.muscles]
        );
  }, [fields, props.muscles]);

  const appendTargetField = useCallback(() => {
    append(defaultTargetValues);
  }, [append]);

  const removeTargetField = useCallback(
    (index: number) => {
      if (canRemoveTargetField) {
        return;
      }

      remove(index);
    },
    [canRemoveTargetField, remove]
  );

  const firstTarget = targets[0];
  const canAppendTargetField = useMemo(() => {
    const isTargetErrorExist = (() => {
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
    })();

    const isLastMuscleOption = fields.length === props.muscles.length;

    const isFirstTargetFilled = (() => {
      const isMuscleSelected =
        firstTarget?.muscleId !== defaultTargetValues.muscleId;
      const isRatioInput = firstTarget?.ratio !== defaultTargetValues.ratio;

      return isMuscleSelected && isRatioInput;
    })();

    return !isTargetErrorExist && !isLastMuscleOption && isFirstTargetFilled;
  }, [
    errors.targets,
    fields.length,
    firstTarget?.muscleId,
    firstTarget?.ratio,
    props.muscles.length,
  ]);

  const submit = useCallback(async (): Promise<Result<null>> => {
    const fieldValue = getValues();

    try {
      const validExerciseField = new ValidExerciseField(fieldValue);

      const exercise = toExercise({
        fieldValue: validExerciseField,
        muscles: props.muscles,
      });

      const isSameNameExerciseExist = await props.isSameNameExerciseExist(
        exercise
      );
      if (isSameNameExerciseExist) {
        throw new Error(`種目「${exercise.name}」はすでに登録されています`);
      }

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
    isValid: isValid && errors.totalRatio === undefined,
    targetIdList,
    canRemoveTargetField,
    muscleOptions,
    appendTargetField,
    removeTargetField,
    canAppendTargetField,
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
