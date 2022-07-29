import {
  Button,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { MouseEventHandler, FC, FormEventHandler, useState } from "react";
import { Muscle } from "../muscle";
import { useMuscleForm } from "../use-muscle-form";

type Props = {
  cancel: () => void;
  registerMuscle: (_muscle: Muscle) => Promise<void>;
  isSameNameMuscleExist: (_muscle: Muscle) => Promise<boolean>;
};
export const RegisterMuscleModal: FC<Props> = ({
  cancel,
  registerMuscle,
  isSameNameMuscleExist,
}) => {
  const { register, errors, isValid, submit } = useMuscleForm({
    registerMuscle,
    isSameNameMuscleExist,
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (_e) => {
    cancel();
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const result = await submit();
    setIsLoading(false);

    if (result.isSuccess) {
      toast({
        title: "登録しました",
        status: "success",
        isClosable: true,
      });
      cancel();
    } else {
      toast({
        title: result.error.message,
        status: "error",
        isClosable: true,
      });
    }
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
      <Button onClick={handleCancel}>キャンセル</Button>
      <Button type="submit" isDisabled={!isValid}>
        {isLoading ? <Spinner /> : "鍛えたい部位を登録"}
      </Button>
    </form>
  );
};
