import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";
import { Workout } from "../workout";
import { RegisterWorkoutForm } from "./register-workout-form";
import { Exercise, Target } from "@/features/exercise/exercise";
import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";

type Meta = ComponentMeta<typeof RegisterWorkoutForm>;
type Props = ComponentProps<typeof RegisterWorkoutForm>;
type Story = ComponentStoryObj<typeof RegisterWorkoutForm>;

const componentMeta: Meta = {
  component: RegisterWorkoutForm,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const exercises = [
    buildExercise({
      name: "ベンチプレス",
      targets: [
        buildTarget({
          muscle: buildMuscle("大胸筋"),
          ratio: 50,
        }),
        buildTarget({
          muscle: buildMuscle("上腕三頭筋"),
          ratio: 30,
        }),
        buildTarget({
          muscle: buildMuscle("三角筋前部"),
          ratio: 20,
        }),
      ],
      memo: "",
    }),
    buildExercise({
      name: "スクワット",
      targets: [
        buildTarget({
          muscle: buildMuscle("大腿四頭筋"),
          ratio: 50,
        }),
        buildTarget({
          muscle: buildMuscle("ハムストリングス"),
          ratio: 30,
        }),
        buildTarget({
          muscle: buildMuscle("カーフ"),
          ratio: 20,
        }),
      ],
      memo: "",
    }),
    buildExercise({
      name: "デッドリフト",
      targets: [
        buildTarget({
          muscle: buildMuscle("脊柱起立筋"),
          ratio: 40,
        }),
        buildTarget({
          muscle: buildMuscle("ハムストリングス"),
          ratio: 20,
        }),
        buildTarget({
          muscle: buildMuscle("僧帽筋"),
          ratio: 20,
        }),
        buildTarget({
          muscle: buildMuscle("広背筋"),
          ratio: 20,
        }),
      ],
      memo: "ナロー",
    }),
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
    trainee:
      props.trainee ??
      buildTrainee({
        id: "trainee",
        name: "太郎",
        image:
          "https://1.bp.blogspot.com/-BnPjHnaxR8Q/YEGP_e4vImI/AAAAAAABdco/2i7s2jl14xUhqtxlR2P3JIsFz76EDZv3gCNcBGAsYHQ/s400/buranko_boy_smile.png",
      }),
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

const buildMuscle = (name: string) => {
  const buildMuscleResult = Muscle.build({ name });

  if (!buildMuscleResult.isSuccess) {
    throw new Error(buildMuscleResult.error.message);
  }

  return buildMuscleResult.data;
};

const buildExercise = (props: {
  name: string;
  targets: Target[];
  memo: string;
}) => {
  const buildExerciseResult = Exercise.build({
    name: props.name,
    targets: props.targets,
    memo: props.memo,
  });

  if (!buildExerciseResult.isSuccess) {
    throw new Error(buildExerciseResult.error.message);
  }

  return buildExerciseResult.data;
};

const buildTrainee = (props: { id: string; name: string; image: string }) => {
  const buildTraineeResult = Trainee.reconstruct({
    id: props.id,
    name: props.name,
    image: props.image,
  });

  if (!buildTraineeResult.isSuccess) {
    throw new Error(buildTraineeResult.error.message);
  }

  return buildTraineeResult.data;
};

const buildTarget = (props: { muscle: Muscle; ratio: number }) => {
  const buildTargetResult = Target.build({
    muscle: props.muscle,
    ratio: props.ratio,
  });

  if (!buildTargetResult.isSuccess) {
    throw new Error(buildTargetResult.error.message);
  }

  return buildTargetResult.data;
};

const selectExercise = async (index: number, value: string) => {
  const exerciseSelect = screen.getByRole("combobox", {
    name: `種目${index + 1}`,
  });
  const exerciseOption = screen.getByRole("option", { name: value });

  await userEvent.selectOptions(exerciseSelect, exerciseOption);
};

const inputWeight = async (index: number, value: string) => {
  const weightInput = screen.getByRole("textbox", {
    name: `種目${index + 1}の重量`,
  });

  await userEvent.type(weightInput, value);
};

const inputRepetition = async (index: number, value: string) => {
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
    await selectExercise(0, "ベンチプレス");
    await inputWeight(0, "100");
    await inputRepetition(0, "5");
  },
};

export const 必須項目を入力してワークアウトを登録: Story = {
  ...Default,
  play: async () => {
    await selectExercise(0, "ベンチプレス");
    await inputWeight(0, "100");
    await inputRepetition(0, "5");
    await clickSubmitButton();
  },
};

export const 重量に不正な値を入力: Story = {
  ...Default,
  play: async () => {
    await inputWeight(0, "不正な値");
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
    await selectExercise(0, "ベンチプレス");
    await inputWeight(0, "100");
    await inputRepetition(0, "5");
    await clickSubmitButton();
  },
};
