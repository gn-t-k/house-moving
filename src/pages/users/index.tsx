import { Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useGetUserList } from "@/features/user/use-get-user-list";
import { User } from "@/features/user/user";
import { UserList } from "@/features/user/user-list/user-list";
import { LinkArea } from "@/ui/link-area/link-area";

const UserPage: NextPage = () => {
  const { getUserList } = useGetUserList();
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getUserList();

      setUserList(result.isSuccess ? result.data : []);
    })();
  }, [getUserList]);

  return (
    // TODO: コンポーネント切り出し
    <Stack direction={"column"}>
      <LinkArea href="/users/new">
        <Text as="u">create new user</Text>
      </LinkArea>
      <UserList {...{ userList }} />
    </Stack>
  );
};

export default UserPage;
