import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { ulid } from "ulid";
import { Muscle } from "./muscle";
import { useForm } from "@/ui/form/use-form";
import { Result } from "@/util/result";

export type MuscleField = {
  name: string;
};
export const defaultValues: MuscleField = {
  name: "",
};

type UseMuscleForm = (_props: {
  defaultValues?: MuscleField;
  registerMuscle: (_muscle: Muscle) => Promise<void>;
  isSameNameMuscleExist: (_muscle: Muscle) => Promise<boolean>;
}) => {
  register: UseFormReturn<MuscleField>["register"];
  errors: UseFormReturn<MuscleField>["formState"]["errors"];
  isValid: boolean;
  submit: () => Promise<Result<null>>;
};
export const useMuscleForm: UseMuscleForm = (props) => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
  } = useForm<MuscleField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "all",
  });

  const submit = useCallback(async (): Promise<Result<null>> => {
    const fieldValue = getValues();

    try {
      const muscle: Muscle = {
        id: ulid(),
        name: fieldValue.name,
      };

      const isSameNameMuscleExist = await props.isSameNameMuscleExist(muscle);
      if (isSameNameMuscleExist) {
        throw new Error(`部位「${muscle.name}」はすでに登録されています`);
      }

      await handleSubmit(async () => {
        await props.registerMuscle(muscle);
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
    submit,
  };
};
