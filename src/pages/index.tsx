import { Spinner, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { AccountPage } from "@/features/account/account-page";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !(session === null || session === undefined);
  const isLoading = status === "loading";
  console.log({ session });

  return isLoading ? (
    <Spinner />
  ) : isLoggedIn ? (
    <AccountPage
      isLoggedIn={true}
      userName={session.user?.name ?? "unknown user"}
      userIcon={session.user?.image ?? ""} // TODO: 画像のURL用意する
      logout={signOut}
    />
  ) : (
    <AccountPage isLoggedIn={false} login={signIn} />
  );
};

export default Home;
