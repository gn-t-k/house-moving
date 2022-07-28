import { Button, useDisclosure } from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";
import { Exercise } from "../exercise";
import { RegisterExerciseModal } from "./register-exercise-modal";
import { Muscle } from "@/features/muscle/muscle";

type Meta = ComponentMeta<typeof RegisterExerciseModal>;
type Props = ComponentProps<typeof RegisterExerciseModal>;
type Story = ComponentStoryObj<typeof RegisterExerciseModal>;

const componentMeta: Meta = {
  component: RegisterExerciseModal,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const args: Props = {
    muscles: props.muscles ?? muscles,
    isOpen: props.isOpen ?? isOpen,
    onClose: props.onClose ?? onClose,
    registerExercise: props.registerExercise ?? registerExercise,
  };

  return (
    <>
      <Button onClick={onOpen}>open modal</Button>
      <RegisterExerciseModal {...args} />
    </>
  );
};

const openModal = async () => {
  const openModalButton = screen.getByText<HTMLButtonElement>("open modal");

  await userEvent.click(openModalButton);
};

const inputExercise = async (value: string) => {
  const exerciseInput = screen.getByLabelText<HTMLInputElement>("種目名");

  await userEvent.type(exerciseInput, value);
};

const selectMuscle = async (id: string, index: number) => {
  const muscleSelect = screen.getByLabelText<HTMLSelectElement>(
    `部位${index + 1}`
  );
  const muscleOption = screen.getByTestId(`${index}-${id}`);

  await userEvent.selectOptions(muscleSelect, muscleOption);
};

const inputRatio = async (value: string, index: number) => {
  const ratioInput = screen.getByLabelText<HTMLInputElement>(
    `種目における部位${index + 1}の割合`
  );

  await userEvent.type(ratioInput, value);
};

const clickSubmitButton = async () => {
  const submitButton = screen.getByText("種目を登録");

  await userEvent.click(submitButton);
};

const clickAddButton = async () => {
  const addButton = screen.getByText("追加");

  await userEvent.click(addButton);
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
    await openModal();
    await inputExercise("ベンチプレス");
    await selectMuscle("muscle-1", 0);
    await inputRatio("100", 0);
  },
};

export const 必須項目を入力して登録: Story = {
  ...Default,
  play: async () => {
    await openModal();
    await inputExercise("ベンチプレス");
    await selectMuscle("muscle-1", 0);
    await inputRatio("100", 0);
    await clickSubmitButton();
  },
};

export const 部位の割合が不正な場合のエラー: Story = {
  ...Default,
  play: async () => {
    await openModal();

    await inputExercise("ベンチプレス");

    await selectMuscle("muscle-1", 0);
    await inputRatio("90", 0);

    await clickAddButton();

    await selectMuscle("muscle-2", 1);
    await inputRatio("20", 1);

    await clickSubmitButton();
  },
};
