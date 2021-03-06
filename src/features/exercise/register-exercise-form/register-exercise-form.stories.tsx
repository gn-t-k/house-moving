import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";
import { Exercise } from "../exercise";
import { RegisterExerciseForm } from "./register-exercise-form";
import { Muscle } from "@/features/muscle/muscle";

type Meta = ComponentMeta<typeof RegisterExerciseForm>;
type Props = ComponentProps<typeof RegisterExerciseForm>;
type Story = ComponentStoryObj<typeof RegisterExerciseForm>;

const componentMeta: Meta = {
  component: RegisterExerciseForm,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const muscles: Muscle[] = [
    {
      id: "muscle-1",
      name: "大胸筋",
    },
    {
      id: "muscle-2",
      name: "上腕三頭筋",
    },
    {
      id: "muscle-3",
      name: "三角筋前部",
    },
  ];
  const registerExercise = async (exercise: Exercise) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("registerExercise")(exercise);
  };
  const cancel = action("cancel");
  const isSameNameExerciseExist = async (exercise: Exercise) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("isSameNameExerciseExist")(exercise);

    return false;
  };

  const args: Props = {
    muscles: props.muscles ?? muscles,
    cancel: props.cancel ?? cancel,
    registerExercise: props.registerExercise ?? registerExercise,
    isSameNameExerciseExist:
      props.isSameNameExerciseExist ?? isSameNameExerciseExist,
  };

  return <RegisterExerciseForm {...args} />;
};

const inputExercise = async (value: string) => {
  const exerciseInput = screen.getByRole("textbox", { name: "種目名" });

  await userEvent.type(exerciseInput, value);
};

const selectMuscle = async (value: string, index: number) => {
  const muscleSelect = screen.getByRole("combobox", {
    name: `部位${index + 1}`,
  });
  const muscleOption = screen.getByRole("option", { name: value });

  await userEvent.selectOptions(muscleSelect, muscleOption);
};

const inputRatio = async (value: string, index: number) => {
  const ratioInput = screen.getByRole("textbox", {
    name: `種目における部位${index + 1}の割合`,
  });

  await userEvent.type(ratioInput, value);
};

const clickSubmitButton = async () => {
  const submitButton = screen.getByText("種目を登録");

  await userEvent.click(submitButton);
};

const clickAddButton = async () => {
  const addButton = screen.getByText("部位を追加");

  await userEvent.click(addButton);
};

const offFocus = async () => {
  await userEvent.tab();
};

const Template: Story = {
  render: (props: Props) => <Wrapper {...props} />,
};

export const Default: Story = {
  ...Template,
};

export const 必須項目を入力: Story = {
  ...Default,
  play: async () => {
    await inputExercise("ベンチプレス");
    await selectMuscle("大胸筋", 0);
    await inputRatio("100", 0);
  },
};

export const 必須項目を入力して登録: Story = {
  ...Default,
  play: async () => {
    await inputExercise("ベンチプレス");
    await selectMuscle("大胸筋", 0);
    await inputRatio("100", 0);
    await offFocus();
    await clickSubmitButton();
  },
};

export const 部位の割合が不正な場合のエラー: Story = {
  ...Default,
  play: async () => {
    await inputExercise("ベンチプレス");

    await selectMuscle("大胸筋", 0);
    await inputRatio("90", 0);

    await clickAddButton();

    await inputRatio("20", 1);

    await offFocus();

    await clickSubmitButton();
  },
};
