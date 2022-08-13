import { Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuthState } from "@/features/auth/use-auth";
import { TraineePage } from "@/features/trainee/trainee-page";

const Home: NextPage = () => {
  const [auth, { logout }] = useAuthState({
    redirectIfLoggedOut: true,
  });

  if (auth.status !== "authenticated") {
    return <Spinner />;
  }

  const { name, image } = auth.session;

  return (
    <TraineePage
      userName={name}
      userIcon={image} // TODO: 画像のURL用意する
      logout={logout}
    />
  );
};

export default Home;
