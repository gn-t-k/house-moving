import { Input, Stack, Button, Select } from "@chakra-ui/react";
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
  console.log({ errors });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workoutSets",
  });

  const handleAppend: MouseEventHandler<HTMLButtonElement> = (_e) => {
    append(defaultValues);
  };
  const handleRemove =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      remove(index);
    };
  const a = { ...register(`workoutSets.${0}.memo`) };
  a.disabled;

  return (
    <Stack direction="column">
      {fields.map((field, index) => (
        <Stack key={field.id} direction="row">
          <Stack direction="column">
            <Select placeholder="種目を選択">
              {props.exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </Select>
            <Input
              {...register(`workoutSets.${index}.weight`, {
                required: true,
                validate: {
                  number: (value) =>
                    !Number.isNaN(parseInt(value)) || "数字を入力してください",
                },
              })}
            />
            <p>{errors.workoutSets?.[index]?.weight?.message}</p>
            <Input {...register(`workoutSets.${index}.memo`)} />
          </Stack>
          <Button onClick={handleRemove(index)}>削除</Button>
        </Stack>
      ))}
      <Button onClick={handleAppend}>追加</Button>
    </Stack>
  );
};
