import { Button, useDisclosure } from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
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
  const getMuscleById = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("getMuscleById")(id);

    return muscles[0];
  };
  const registerExercise = async (exercise: Exercise) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("registerExercise")(exercise);
  };

  const args: Props = {
    muscles: props.muscles ?? muscles,
    isOpen: props.isOpen ?? isOpen,
    onClose: props.onClose ?? onClose,
    getMuscleById: props.getMuscleById ?? getMuscleById,
    registerExercise: props.registerExercise ?? registerExercise,
  };

  return (
    <>
      <Button onClick={onOpen}>open modal</Button>
      <RegisterExerciseModal {...args} />
    </>
  );
};

const Template: Story = {
  render: (props: Props) => <Wrapper {...props} />,
};

export const Default: Story = {
  ...Template,
};
