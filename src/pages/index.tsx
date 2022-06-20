import { Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { HelloWorld } from "@/features/hello/hello-world/hello-world";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !(session === null || session === undefined);
  const isLoading = status === "loading";

  return isLoading ? (
    <Spinner />
  ) : isLoggedIn ? (
    <HelloWorld
      isLoggedIn={isLoggedIn}
      userName={session.user?.name ?? "unknown user"}
      logout={signOut}
    />
  ) : (
    <HelloWorld isLoggedIn={isLoggedIn} login={signIn} />
  );
};

export default Home;
