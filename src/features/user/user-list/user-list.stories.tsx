import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { createUserID, User, UserID } from "../user";
import { UserList } from "./user-list";

type Meta = ComponentMeta<typeof UserList>;
type Props = ComponentProps<typeof UserList>;
type Story = ComponentStoryObj<typeof UserList>;

const componentMeta: Meta = {
  component: UserList,
};
export default componentMeta;

const dummyUserList: User[] = [
  {
    identified: true,
    id: createUserID("aaa"),
    name: "name1",
    tel: "0000000000",
    bloodType: "A",
  },
  {
    identified: true,
    id: createUserID("iii"),
    name: "name2",
    tel: "1111111111",
    bloodType: null,
  },
];

const Template: Story = {
  render: (props: Partial<Props>) => (
    <UserList userList={props.userList ?? dummyUserList} />
  ),
};

export const Default: Story = {
  ...Template,
};
