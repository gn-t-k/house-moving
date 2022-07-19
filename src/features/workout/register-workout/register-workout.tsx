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
import { FC, FormEventHandler, MouseEventHandler } from "react";
import { useWorkoutForm } from "../use-workout-form";
import { Workout } from "../workout";
import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";

type Props = {
  exercises: Exercise[];
  registerWorkout: (_workout: Workout) => Promise<void>;
  trainee: Trainee;
  date: Date;
  getExerciseById: (_id: string) => Promise<Exercise>;
};
export const RegisterWorkout: FC<Props> = (props) => {
  const {
    register,
    errors,
    workoutSetIdList,
    isLastField,
    appendWorkoutSetField,
    removeWorkoutSetField,
    handleSubmit,
  } = useWorkoutForm({
    trainee: props.trainee,
    date: props.date,
    getExerciseById: props.getExerciseById,
    registerWorkout: props.registerWorkout,
  });

  const handleAppend: MouseEventHandler<HTMLButtonElement> = (_e) => {
    appendWorkoutSetField();
  };
  const handleRemove =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      removeWorkoutSetField(index);
    };
  const handleClickSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const result = await handleSubmit();

    if (!result.isSuccess) {
      // TODO: トーストとか出す
    }
  };

  return (
    <form onSubmit={handleClickSubmit}>
      <Stack direction="column">
        {workoutSetIdList.map((id, index) => (
          <Stack key={id} direction="row">
            <Stack direction="column">
              <FormControl
                isInvalid={
                  errors.workoutSets?.[index]?.exerciseId !== undefined
                }
              >
                <FormLabel>種目</FormLabel>
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
                isInvalid={
                  errors.workoutSets?.[index]?.repetition !== undefined
                }
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
            </Stack>
            <Button onClick={handleRemove(index)} disabled={isLastField}>
              削除
            </Button>
          </Stack>
        ))}
        <Button onClick={handleAppend}>追加</Button>
        <FormControl>
          <FormLabel>メモ</FormLabel>
          <Textarea {...register("memo")} />
        </FormControl>
        <Button type="submit">ワークアウトを登録</Button>
      </Stack>
    </form>
  );
};
