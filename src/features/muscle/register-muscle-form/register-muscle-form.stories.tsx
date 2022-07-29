import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";
import { Muscle } from "../muscle";
import { RegisterMuscleModal } from "./register-muscle-form";

type Meta = ComponentMeta<typeof RegisterMuscleModal>;
type Props = ComponentProps<typeof RegisterMuscleModal>;
type Story = ComponentStoryObj<typeof RegisterMuscleModal>;

const componentMeta: Meta = {
  component: RegisterMuscleModal,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const cancel = action("cancel");
  const registerMuscle = async (muscle: Muscle) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("registerMuscle")(muscle);
  };
  const isSameNameMuscleExist = async (muscle: Muscle) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    action("isSameNameMuscleExist")(muscle);

    return false;
  };

  const args: Props = {
    cancel: props.cancel ?? cancel,
    registerMuscle: props.registerMuscle ?? registerMuscle,
    isSameNameMuscleExist: props.isSameNameMuscleExist ?? isSameNameMuscleExist,
  };

  return <RegisterMuscleModal {...args} />;
};

const Template: Story = {
  render: (props: Props) => <Wrapper {...props} />,
};

export const Default: Story = {
  ...Template,
};

const inputMuscleName = async (value: string) => {
  const muscleNameInput = screen.getByRole("textbox", { name: "部位名" });

  if (value !== "") {
    await userEvent.type(muscleNameInput, value);
  } else {
    await userEvent.clear(muscleNameInput);
  }
};

const clickSubmitButton = async () => {
  const submitButton = screen.getByText("鍛えたい部位を登録");

  await userEvent.click(submitButton);
};

export const 部位名を入力: Story = {
  ...Default,
  play: async () => {
    await inputMuscleName("大胸筋");
  },
};

export const 部位名を入力して登録: Story = {
  ...Default,
  play: async () => {
    await inputMuscleName("大胸筋");
    await clickSubmitButton();
  },
};

export const 部位名を入力して消去: Story = {
  ...Default,
  play: async () => {
    await inputMuscleName("大胸筋");
    await inputMuscleName("");
  },
};

export const 部位がすでに登録されていた場合: Story = {
  render: () => {
    const isSameNameMuscleExist = async (_muscle: Muscle) => true;

    return <Wrapper isSameNameMuscleExist={isSameNameMuscleExist} />;
  },
  play: async () => {
    await inputMuscleName("大胸筋");
    await clickSubmitButton();
  },
};
