import { ListItem, UnorderedList, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { identify, User } from "../user";

type Props = {
  userList: User[];
};

export const UserList: FC<Props> = (props) => (
  <UnorderedList>
    {identify(props.userList).map((user) => (
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
