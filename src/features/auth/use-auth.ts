import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { isValidSession, Session } from "./session";

type Auth =
  | {
      status: "loading";
    }
  | {
      status: "authenticated";
      session: Session;
    }
  | {
      status: "unauthenticated";
    };

const authRecoilState = atom<Auth>({
  key: "authState",
  default: { status: "unauthenticated" },
});

type Props = {
  redirectIfLoggedOut: boolean;
};
type UseAuthState = (_props?: Props) => [
  Auth,
  {
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }
];
export const useAuthState: UseAuthState = (
  props = { redirectIfLoggedOut: false }
) => {
  const authState = useRecoilValue(authRecoilState);
  const setAuthState = useSetRecoilState(authRecoilState);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    const isLoggedIn = status === "authenticated";

    setAuthState(
      data === undefined
        ? { status: "loading" }
        : !isValidSession(data)
        ? { status: "unauthenticated" }
        : status === "authenticated"
        ? { status, session: data }
        : { status }
    );

    if (
      props.redirectIfLoggedOut &&
      !isLoggedIn &&
      router.pathname !== "/login"
    ) {
      router.replace("/login");
    }
    if (router.pathname === "/login" && isLoggedIn) {
      router.replace("/");
    }
  }, [data, props.redirectIfLoggedOut, router, setAuthState, status]);

  const login = useCallback(async () => {
    await signIn();
  }, []);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  return [authState, { login, logout }];
};
