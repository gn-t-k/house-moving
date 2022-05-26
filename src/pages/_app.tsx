import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

function HouseMoving({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default HouseMoving;
