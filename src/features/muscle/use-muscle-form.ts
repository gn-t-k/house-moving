import { UseFormReturn } from "react-hook-form";
import { Muscle } from "./muscle";
import { useForm } from "@/ui/form/use-form";
import { Async } from "@/util/async";
import { Result } from "@/util/result";
import { useAsync } from "@/util/use-async";

export type MuscleField = {
  name: string;
};
export const defaultValues: MuscleField = {
  name: "",
};

type UseMuscleForm = (_props: {
  defaultValues?: MuscleField;
  registerMuscle: (_muscle: Muscle) => Promise<Result<void>>;
  getMuscleByName: (_name: string) => Promise<Result<Muscle | null>>;
}) => {
  register: UseFormReturn<MuscleField>["register"];
  errors: UseFormReturn<MuscleField>["formState"]["errors"];
  isValid: boolean;
  submit: () => void;
  submitState: Async<void>;
};
export const useMuscleForm: UseMuscleForm = (props) => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<MuscleField>({
    defaultValues: props.defaultValues ?? defaultValues,
    mode: "all",
  });
  const [submitState, { start, done }] = useAsync<void>();

  const submit = handleSubmit(async (fieldValue) => {
    start();

    const { name } = fieldValue;

    const getMuscleByNameResult = await props.getMuscleByName(name);

    if (!getMuscleByNameResult.isSuccess) {
      done({
        isSuccess: false,
        error: {
          message: "部位の登録に失敗しました",
        },
      });

      return;
    }

    if (getMuscleByNameResult.data !== null) {
      done({
        isSuccess: false,
        error: {
          message: `部位「${name}」はすでに登録されています`,
        },
      });

      return;
    }

    const registerMuscleResult = await props.registerMuscle(
      new Muscle({ name })
    );

    done(
      registerMuscleResult.isSuccess
        ? registerMuscleResult
        : { isSuccess: false, error: { message: "部位の登録に失敗しました" } }
    );
  });

  return {
    register,
    errors,
    isValid,
    submit,
    submitState,
  };
};
