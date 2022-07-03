import { Spinner, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !(session === null || session === undefined);
  const isLoading = status === "loading";

  return isLoading ? (
    <Spinner />
  ) : isLoggedIn ? (
    <Text>logged in</Text>
  ) : (
    <Text>logged out</Text>
  );
};

export default Home;
