import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { within } from "@storybook/testing-library";
import { ComponentProps } from "react";
import { CreateUserView } from "./create-user";
import { Result } from "@/util/result";

type Meta = ComponentMeta<typeof CreateUserView>;
type Props = ComponentProps<typeof CreateUserView>;
type Story = ComponentStoryObj<typeof CreateUserView>;

const componentMeta: Meta = {
  component: CreateUserView,
};
export default componentMeta;

const dummyCreateUser = (): Promise<Result<void>> => {
  action("create user");

  return Promise.resolve({
    isSuccess: true,
    data: undefined,
  });
};

const Template: Story = {
  render: (props: Partial<Props>) => (
    <CreateUserView onClick={props.onClick ?? dummyCreateUser} />
  ),
};

export const Default: Story = {
  ...Template,
};

export const ClickButton: Story = {
  ...Default,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    userEvent.click(canvas.getByText<HTMLInputElement>("create user"));
  },
};
