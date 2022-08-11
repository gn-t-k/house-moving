import {
  Button,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FC, FormEventHandler, useEffect } from "react";
import { Muscle } from "../muscle";
import { useMuscleForm } from "../use-muscle-form";
import { Result } from "@/util/result";

type Props = {
  registerMuscle: (_muscle: Muscle) => Promise<Result<void>>;
  getMuscleByName: (_name: string) => Promise<Result<Muscle | null>>;
};
export const RegisterMuscleForm: FC<Props> = ({
  registerMuscle,
  getMuscleByName,
}) => {
  const { register, errors, isValid, submit, submitState } = useMuscleForm({
    registerMuscle,
    getMuscleByName,
  });
  const toast = useToast();

  useEffect(() => {
    if (submitState.status !== "done") {
      return;
    }

    toast(
      submitState.isSuccess
        ? {
            title: "登録しました",
            status: "success",
            isClosable: true,
          }
        : {
            title: submitState.error.message,
            status: "error",
            isClosable: true,
          }
    );
  }, [submitState, toast]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    submit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isRequired isInvalid={errors.name !== undefined}>
        <FormLabel>部位名</FormLabel>
        <Input
          {...register(`name`, {
            required: {
              value: true,
              message: "部位名が入力されていません",
            },
          })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Button type="submit" isDisabled={!isValid}>
        {submitState.status === "loading" ? <Spinner /> : "鍛えたい部位を登録"}
      </Button>
    </form>
  );
};
