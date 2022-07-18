import {
  Input,
  Stack,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { FC, MouseEventHandler } from "react";
import { useFieldArray } from "react-hook-form";
import { defaultValues, useWorkoutForm } from "../use-workout-form";
import { Exercise } from "@/features/exercise/exercise";

type Props = {
  exercises: Exercise[];
};
export const RegisterWorkout: FC<Props> = (props) => {
  const {
    control,
    register,
    formState: { errors },
  } = useWorkoutForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workoutSets",
  });

  const isLastField = fields.length === 1;

  const appendField: MouseEventHandler<HTMLButtonElement> = (_e) => {
    append(defaultValues);
  };
  const removeField =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      if (isLastField) {
        return;
      }

      remove(index);
    };

  return (
    <Stack direction="column">
      {fields.map((field, index) => (
        <Stack key={field.id} direction="row">
          <Stack direction="column">
            <FormControl
              isInvalid={errors.workoutSets?.[index]?.exerciseId !== undefined}
            >
              <FormLabel>種目を選択</FormLabel>
              <Select
                placeholder="未選択"
                {...register(`workoutSets.${index}.exerciseId`, {
                  required: { value: true, message: "入力必須です" },
                })}
              >
                {props.exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.workoutSets?.[index]?.exerciseId?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.workoutSets?.[index]?.weight !== undefined}
            >
              <FormLabel>重量</FormLabel>
              <Input
                {...register(`workoutSets.${index}.weight`, {
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
                {errors.workoutSets?.[index]?.weight?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.workoutSets?.[index]?.repetition !== undefined}
            >
              <FormLabel>回数</FormLabel>
              <Input
                {...register(`workoutSets.${index}.repetition`, {
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
                {errors.workoutSets?.[index]?.repetition?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>メモ</FormLabel>
              <Textarea {...register(`workoutSets.${index}.memo`)} />
            </FormControl>
          </Stack>
          <Button onClick={removeField(index)} disabled={isLastField}>
            削除
          </Button>
        </Stack>
      ))}
      <Button onClick={appendField}>追加</Button>
    </Stack>
  );
};
