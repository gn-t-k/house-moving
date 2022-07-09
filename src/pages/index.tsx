import type { NextPage } from "next";
import { AccountPage } from "@/features/account/account-page";
import { useAuthState } from "@/features/auth/use-auth";

const Home: NextPage = () => {
  const [auth, { logout }] = useAuthState({
    redirectIfLoggedOut: true,
  });

  if (auth.status !== "authenticated") {
    return null;
  }

  const { name, image } = auth.session;

  return (
    <AccountPage
      userName={name}
      userIcon={image} // TODO: 画像のURL用意する
      logout={logout}
    />
  );
};

export default Home;
