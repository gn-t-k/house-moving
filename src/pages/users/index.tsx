import { Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useGetUserList } from "@/features/user/use-get-user-list";
import { UserList } from "@/features/user/user-list/user-list";
import { LinkArea } from "@/ui/link-area/link-area";

const UserPage: NextPage = () => {
  const { isLoading, getUserList, userList, error } = useGetUserList();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(console.log);
    (async () => {
      await getUserList();
    })();
  }, [getUserList]);

  return isLoading ? (
    <Text>Loading…</Text>
  ) : error !== null ? (
    <Text>{error}</Text>
  ) : userList.length === 0 ? (
    <Text>no user exist</Text>
  ) : (
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
