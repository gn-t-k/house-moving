import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";
import { Workout } from "../workout";
import { RegisterWorkoutForm } from "./register-workout-form";
import { Exercise } from "@/features/exercise/exercise";

type Meta = ComponentMeta<typeof RegisterWorkoutForm>;
type Props = ComponentProps<typeof RegisterWorkoutForm>;
type Story = ComponentStoryObj<typeof RegisterWorkoutForm>;

const componentMeta: Meta = {
  component: RegisterWorkoutForm,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
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
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("registerWorkout")(workout);
  };
  const redirectToEditPage = () => {
    action("redirectToEditPage")();
  };

  const args: Props = {
    exercises: props.exercises ?? exercises,
    registerWorkout: props.registerWorkout ?? registerWorkout,
    trainee: props.trainee ?? {
      id: "trainee",
      name: "太郎",
      image:
        "https://1.bp.blogspot.com/-BnPjHnaxR8Q/YEGP_e4vImI/AAAAAAABdco/2i7s2jl14xUhqtxlR2P3JIsFz76EDZv3gCNcBGAsYHQ/s400/buranko_boy_smile.png",
    },
    date: props.date ?? new Date(2022, 6, 19),
    redirectToEditPage: props.redirectToEditPage ?? redirectToEditPage,
  };

  return <RegisterWorkoutForm {...args} />;
};

const Template: Story = {
  render: (props) => <Wrapper {...props} />,
};

export const Default: Story = {
  ...Template,
};

const selectExercise = async (value: string, index: number) => {
  const exerciseSelect = screen.getByRole("combobox", {
    name: `種目${index + 1}`,
  });
  const exerciseOption = screen.getByRole("option", { name: value });

  await userEvent.selectOptions(exerciseSelect, exerciseOption);
};

const inputWeight = async (value: string, index: number) => {
  const weightInput = screen.getByRole("textbox", {
    name: `種目${index + 1}の重量`,
  });

  await userEvent.type(weightInput, value);
};

const inputRepetition = async (value: string, index: number) => {
  const repetitionInput = screen.getByRole("textbox", {
    name: `種目${index + 1}の回数`,
  });

  await userEvent.type(repetitionInput, value);
};

const clickSubmitButton = async () => {
  const submitButton = screen.getByText("ワークアウトを登録");

  await userEvent.click(submitButton);
};

export const 必須項目を入力: Story = {
  ...Default,
  play: async () => {
    await selectExercise("ベンチプレス", 0);
    await inputWeight("100", 0);
    await inputRepetition("5", 0);
  },
};

export const 必須項目を入力してワークアウトを登録: Story = {
  ...Default,
  play: async () => {
    await selectExercise("ベンチプレス", 0);
    await inputWeight("100", 0);
    await inputRepetition("5", 0);
    await clickSubmitButton();
  },
};

export const 重量に不正な値を入力: Story = {
  ...Default,
  play: async () => {
    await inputWeight("不正な値", 0);
  },
};

export const 登録に失敗する場合: Story = {
  render: () => {
    const registerWorkout = (_workout: Workout) => {
      throw new Error("登録に失敗しました");
    };

    return <Wrapper registerWorkout={registerWorkout} />;
  },
  play: async () => {
    await selectExercise("ベンチプレス", 0);
    await inputWeight("100", 0);
    await inputRepetition("5", 0);
    await clickSubmitButton();
  },
};
