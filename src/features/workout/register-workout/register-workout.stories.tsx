import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { RegisterWorkout } from "./register-workout";

type Meta = ComponentMeta<typeof RegisterWorkout>;
type Props = ComponentProps<typeof RegisterWorkout>;
type Story = ComponentStoryObj<typeof RegisterWorkout>;

const componentMeta: Meta = {
  component: RegisterWorkout,
};
export default componentMeta;

const Template: Story = {
  render: (props: Props) => <RegisterWorkout {...props} />,
};

export const Default: Story = {
  ...Template,
};