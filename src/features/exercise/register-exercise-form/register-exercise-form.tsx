import {
  Button,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Select,
} from "@chakra-ui/react";
import { FC, FormEventHandler, MouseEventHandler, useState } from "react";
import { Exercise } from "../exercise";
import { useExerciseForm } from "../use-exercise-form";
import { Muscle } from "@/features/muscle/muscle";

type Props = {
  muscles: Muscle[];
  cancel: () => void;
  registerExercise: (_exercise: Exercise) => Promise<void>;
  isSameNameExerciseExist: (_exercise: Exercise) => Promise<boolean>;
};
export const RegisterExerciseForm: FC<Props> = ({
  muscles,
  cancel,
  registerExercise,
  isSameNameExerciseExist,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const {
    register,
    errors,
    isValid,
    muscleOptions,
    targetIdList,
    appendTargetField,
    removeTargetField,
    canAppendTargetField,
    canRemoveTargetField,
    submit,
  } = useExerciseForm({
    muscles,
    registerExercise,
    isSameNameExerciseExist,
  });

  const handleAppendTargetField: MouseEventHandler<HTMLButtonElement> = (
    _e
  ) => {
    appendTargetField();
  };
  const handleRemove =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      removeTargetField(index);
    };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const result = await submit();
    setIsLoading(false);

    toast(
      result.isSuccess
        ? {
            title: "登録しました",
            status: "success",
            isClosable: true,
          }
        : {
            title: result.error.message,
            status: "error",
            isClosable: true,
          }
    );
  };
  const handleCancel: MouseEventHandler<HTMLButtonElement> = (_e) => {
    cancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isRequired isInvalid={errors.name !== undefined}>
        <FormLabel>種目名</FormLabel>
        <Input
          {...register("name", {
            required: {
              value: true,
              message: "入力必須です",
            },
          })}
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.totalRatio !== undefined}>
        <FormLabel>部位</FormLabel>
        {targetIdList.map((id, index) => (
          <Stack key={id} direction="row">
            <Stack direction="column">
              <FormControl
                isRequired
                isInvalid={errors.targets?.[index]?.muscleId !== undefined}
              >
                <FormLabel>部位{index + 1}</FormLabel>
                <Select
                  placeholder="未選択"
                  {...register(`targets.${index}.muscleId`, {
                    required: { value: true, message: "入力必須です" },
                  })}
                >
                  {(() => {
                    const options = muscleOptions[index];

                    return options === undefined
                      ? null
                      : options.map((muscle) => (
                          <option key={muscle.id} value={muscle.id}>
                            {muscle.name}
                          </option>
                        ));
                  })()}
                </Select>
                <FormErrorMessage>
                  {errors.targets?.[index]?.muscleId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.targets?.[index]?.ratio !== undefined}
              >
                <FormLabel>種目における部位{index + 1}の割合</FormLabel>
                <InputGroup>
                  <Input
                    {...register(`targets.${index}.ratio`, {
                      required: { value: true, message: "入力必須です" },
                      validate: {
                        number: (value: string) =>
                          /^[0-9]*$/.test(value) || "数字を入力してください",
                      },
                    })}
                  />
                  <InputRightElement>%</InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.targets?.[index]?.ratio?.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Button
              onClick={handleRemove(index)}
              disabled={canRemoveTargetField}
            >
              部位{index + 1}を削除
            </Button>
          </Stack>
        ))}
        <Button
          onClick={handleAppendTargetField}
          disabled={!canAppendTargetField}
        >
          部位を追加
        </Button>
        <FormErrorMessage>{errors.totalRatio?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>メモ</FormLabel>
        <Input {...register("memo")} />
      </FormControl>
      <Button onClick={handleCancel}>キャンセル</Button>
      <Button type="submit" isDisabled={!isValid}>
        {isLoading ? <Spinner /> : "種目を登録"}
      </Button>
    </form>
  );
};
