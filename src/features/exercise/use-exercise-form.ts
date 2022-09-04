import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Muscle } from "../muscle/muscle";
import { Exercise, Target } from "./exercise";
import { useForm } from "@/ui/form/use-form";
import { hasAtLeastOne } from "@/util/has-at-least-one";
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
  const ratios = targets.map((target) => target.ratio);
  const muscleIds = targets.map((target) => target.muscleId);

  const isRatio100 = useMemo(() => {
    if (ratios.some((ratio) => !/^[0-9]+$/.test(ratio))) {
      return false;
    }

    return (
      ratios
        .map((ratioString) => parseInt(ratioString))
        .reduce((acc, cur) => acc + cur) === 100
    );
  }, [ratios]);

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
    const selectedMuscleIds = muscleIds.filter(
      (id) => id !== defaultTargetValues.muscleId
    );

    return hasAtLeastOne(selectedMuscleIds)
      ? muscleIds.map((muscleId) => {
          const selectableMuscles = props.muscles.filter(
            (muscle) => !selectedMuscleIds.includes(muscle.id)
          );
          const currentSelectedMuscle = props.muscles.find(
            (muscle) => muscle.id === muscleId
          );

          return currentSelectedMuscle !== undefined
            ? [currentSelectedMuscle, ...selectableMuscles]
            : selectableMuscles;
        })
      : [props.muscles];
  }, [muscleIds, props.muscles]);

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
    const errorMessages: string[] = [];
    const fieldValue = getValues();
    const targets = fieldValue.targets.flatMap((target, index) => {
      const muscle = props.muscles.find(
        (muscle) => muscle.id === target.muscleId
      );
      if (muscle === undefined) {
        errorMessages.push(`「種目${index}」に不正な値が入力されています`);
        return [];
      }

      const ratio = parseInt(target.ratio);
      if (ratio === NaN) {
        errorMessages.push(
          `「種目${index}における割合」に不正な値が入力されています`
        );
        return [];
      }

      const buildTargetResult = Target.build({
        muscle,
        ratio,
      });
      if (!buildTargetResult.isSuccess) {
        errorMessages.push(buildTargetResult.error.message);
        return [];
      }

      return [buildTargetResult.data];
    });
    const isTargetsErrorExist = fieldValue.targets.length !== targets.length;
    if (isTargetsErrorExist) {
      return {
        isSuccess: false,
        error: {
          message: errorMessages.join(", "),
        },
      };
    }

    const buildExerciseResult = Exercise.build({
      name: fieldValue.name,
      targets,
      memo: fieldValue.memo,
    });
    if (!buildExerciseResult.isSuccess) {
      return {
        isSuccess: false,
        error: {
          message: buildExerciseResult.error.message,
        },
      };
    }

    const exercise = buildExerciseResult.data;

    try {
      const isSameNameExerciseExist = await props.isSameNameExerciseExist(
        exercise
      );
      if (isSameNameExerciseExist) {
        return {
          isSuccess: false,
          error: {
            message: `種目「${exercise.name}」はすでに登録されています`,
          },
        };
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
