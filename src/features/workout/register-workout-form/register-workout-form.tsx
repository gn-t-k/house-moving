import {
  Input,
  Stack,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FC, FormEventHandler, MouseEventHandler, useState } from "react";
import { useWorkoutForm } from "../use-workout-form";
import { Workout } from "../workout";
import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";

type Props = {
  exercises: Exercise[];
  registerWorkout: (_workout: Workout) => Promise<void>;
  trainee: Trainee;
  date: Date;
  redirectToEditPage: () => void;
};
export const RegisterWorkoutForm: FC<Props> = (props) => {
  const {
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
  } = useWorkoutForm({
    trainee: props.trainee,
    date: props.date,
    exercises: props.exercises,
    registerWorkout: props.registerWorkout,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAppend: MouseEventHandler<HTMLButtonElement> = (_e) => {
    appendRecordField();
  };
  const handleRemove =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      removeRecordField(index);
    };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const result = await submit();
    setIsLoading(false);

    if (!result.isSuccess) {
      toast({
        title: result.error.message,
        status: "error",
        isClosable: true,
      });
    } else {
      props.redirectToEditPage();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column">
        {recordIdList.map((id, index) => (
          <Stack key={id} direction="row">
            <Stack direction="column">
              <FormControl
                isRequired
                isInvalid={errors.records?.[index]?.exerciseId !== undefined}
              >
                <FormLabel>種目{index + 1}</FormLabel>
                <Select
                  placeholder="未選択"
                  {...register(`records.${index}.exerciseId`, {
                    required: { value: true, message: "入力必須です" },
                  })}
                >
                  {(() => {
                    const options = exerciseOptions[index];

                    return options === undefined
                      ? null
                      : options.map((exercise) => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ));
                  })()}
                </Select>
                <FormErrorMessage>
                  {errors.records?.[index]?.exerciseId?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.records?.[index]?.weight !== undefined}
              >
                <FormLabel>種目{index + 1}の重量</FormLabel>
                <Input
                  {...register(`records.${index}.weight`, {
                    required: {
                      value: true,
                      message: "入力必須です",
                    },
                    validate: {
                      number: (value: string) =>
                        /^[0-9]*$/.test(value) || "数字を入力してください",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.records?.[index]?.weight?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.records?.[index]?.repetition !== undefined}
              >
                <FormLabel>種目{index + 1}の回数</FormLabel>
                <Input
                  {...register(`records.${index}.repetition`, {
                    required: {
                      value: true,
                      message: "入力必須です",
                    },
                    validate: {
                      number: (value: string) =>
                        /^[0-9]*$/.test(value) || "数字を入力してください",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.records?.[index]?.repetition?.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Button
              onClick={handleRemove(index)}
              disabled={!canRemoveRecordField}
            >
              種目{index + 1}を削除
            </Button>
          </Stack>
        ))}
        <Button onClick={handleAppend} disabled={!canAppendRecordField}>
          追加
        </Button>
        <FormControl>
          <FormLabel>メモ</FormLabel>
          <Textarea {...register("memo")} />
        </FormControl>
        <Button type="submit" isDisabled={!isValid}>
          {isLoading ? <Spinner /> : "ワークアウトを登録"}
        </Button>
      </Stack>
    </form>
  );
};
