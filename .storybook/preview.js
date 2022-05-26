import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import * as NextImage from "next/image";

const withChakra = (Story) => (
  <MemoryRouterProvider>
    <ChakraProvider>
      <Story />
    </ChakraProvider>
  </MemoryRouterProvider>
);

export const decorators = [withChakra];

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => (
    <OriginalNextImage {...props} placeholder={undefined} unoptimized />
  ),
});
