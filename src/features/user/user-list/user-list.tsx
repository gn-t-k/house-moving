import { ListItem, UnorderedList, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { User } from "../user";
import styles from "./user-list.module.css";

type Props = {
  userList: User[];
};

export const UserList: FC<Props> = (props) => (
  <UnorderedList>
    {props.userList.map((user) => (
      <ListItem key={user.id.value}>
        <Stack direction={"column"}>
          <Text>name: {user.name}</Text>
          <Text>tel: {user.tel}</Text>
          <Text>
            blood type: {user.bloodType === null ? "unknown" : user.bloodType}
          </Text>
        </Stack>
      </ListItem>
    ))}
  </UnorderedList>
);
