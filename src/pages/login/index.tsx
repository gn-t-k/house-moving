import { Button, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "@/features/auth/use-auth";

const Login: NextPage = () => {
  const [authState, { login }] = useAuthState();

  return authState.status === "unauthenticated" ? (
    <Button onClick={login}>ログイン</Button>
  ) : (
    <Spinner />
  );
};

export default Login;
