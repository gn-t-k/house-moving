import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

const HouseMoving = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <RecoilRoot>
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  </RecoilRoot>
);

export default HouseMoving;
