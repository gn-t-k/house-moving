import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { Workout } from "../workout";
import { RegisterWorkout } from "./register-workout";
import { Exercise } from "@/features/exercise/exercise";

type Meta = ComponentMeta<typeof RegisterWorkout>;
type Props = ComponentProps<typeof RegisterWorkout>;
type Story = ComponentStoryObj<typeof RegisterWorkout>;

const componentMeta: Meta = {
  component: RegisterWorkout,
};
export default componentMeta;

const Template: Story = {
  render: (props) => {
    const exercises: Exercise[] = [
      {
        id: "exercise-1",
        name: "ベンチプレス",
        targets: [
          {
            muscle: {
              id: "muscle-1",
              name: "大胸筋",
            },
            ratio: 0.5,
          },
          {
            muscle: {
              id: "muscle-2",
              name: "上腕三頭筋",
            },
            ratio: 0.3,
          },
          {
            muscle: {
              id: "muscle-3",
              name: "三角筋前部",
            },
            ratio: 0.2,
          },
        ],
        memo: "",
      },
      {
        id: "exercise-2",
        name: "スクワット",
        targets: [
          {
            muscle: {
              id: "muscle-4",
              name: "大腿四頭筋",
            },
            ratio: 0.5,
          },
          {
            muscle: {
              id: "muscle-5",
              name: "ハムストリングス",
            },
            ratio: 0.3,
          },
          {
            muscle: {
              id: "muscle-6",
              name: "カーフ",
            },
            ratio: 0.2,
          },
        ],
        memo: "",
      },
      {
        id: "exercise-3",
        name: "デッドリフト",
        targets: [
          {
            muscle: {
              id: "muscle-7",
              name: "脊柱起立筋",
            },
            ratio: 0.4,
          },
          {
            muscle: {
              id: "muscle-5",
              name: "ハムストリングス",
            },
            ratio: 0.2,
          },
          {
            muscle: {
              id: "muscle-8",
              name: "僧帽筋",
            },
            ratio: 0.2,
          },
          {
            muscle: {
              id: "muscle-9",
              name: "広背筋",
            },
            ratio: 0.2,
          },
        ],
        memo: "ナロー",
      },
    ];
    const registerWorkout = async (workout: Workout) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      action("onSubmit")(workout);
    };
    const getExerciseById = async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      action("getExerciseById")(id);

      return exercises;
    };

    const args: Props = {
      exercises: props.exercises ?? exercises,
      registerWorkout: props.registerWorkout ?? registerWorkout,
      trainee: props.trainee ?? {
        id: "trainee",
        name: "太郎",
      },
      date: props.date ?? new Date(2022, 6, 19),
      getExerciseById: props.getExerciseById ?? getExerciseById,
    };

    return <RegisterWorkout {...args} />;
  },
};

export const Default: Story = {
  ...Template,
};

const inputExercise = async (value: string) => {
  const exerciseSelect = screen.getByLabelText<HTMLSelectElement>("種目");
  const exerciseOption = screen.getByRole("option", { name: value });

  await userEvent.selectOptions(exerciseSelect, exerciseOption);
};

const inputWeight = async (value: string) => {
  const weightInput = screen.getByLabelText<HTMLInputElement>("重量");

  await userEvent.type(weightInput, value);
};

const inputRepetition = async (value: string) => {
  const repetitionInput = screen.getByLabelText<HTMLInputElement>("回数");

  await userEvent.type(repetitionInput, value);
};

export const 必須項目を入力: Story = {
  ...Default,
  play: async () => {
    await inputExercise("ベンチプレス");
    await inputWeight("100");
    await inputRepetition("5");
  },
};
