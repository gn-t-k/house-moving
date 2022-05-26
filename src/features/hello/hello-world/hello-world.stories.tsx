import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { HelloWorld } from "./hello-world";

type Meta = ComponentMeta<typeof HelloWorld>;
type Props = ComponentProps<typeof HelloWorld>;
type Story = ComponentStoryObj<typeof HelloWorld>;

const componentMeta: Meta = {
  component: HelloWorld,
};
export default componentMeta;

export const Default: Story = {
  render: (props: Props) => <HelloWorld {...props} />,
};
