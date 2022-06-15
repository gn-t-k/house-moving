import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { fireEvent } from "@testing-library/react";
import { ComponentProps } from "react";
import { createUserID, User } from "../user";
import { CreateUserForm } from "./create-user-form";

type Meta = ComponentMeta<typeof CreateUserForm>;
type Props = ComponentProps<typeof CreateUserForm>;
type Story = ComponentStoryObj<typeof CreateUserForm>;

const componentMeta: Meta = {
  component: CreateUserForm,
};
export default componentMeta;

const dummyCreateUser = async (user: User): Promise<void> => {
  action(JSON.stringify(user))();

  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const Template: Story = {
  render: (props: Partial<Props>) => (
    <CreateUserForm
      createUser={props.createUser ?? dummyCreateUser}
      error={props.error ?? null}
      createdUserID={props.createdUserID ?? createUserID("userID")}
    />
  ),
};

export const Default: Story = {
  ...Template,
};

export const EntryAndSubmit: Story = {
  ...Default,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    userEvent.type(canvas.getByLabelText("名前"), "テスト太郎");
    userEvent.type(canvas.getByLabelText("電話番号"), "1234567890");
    fireEvent.submit(canvas.getByLabelText<HTMLButtonElement>("create user"));
  },
};
