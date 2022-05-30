import { Stack } from "@chakra-ui/react";
import { FC } from "react";
import { LinkArea } from "@/ui/link-area/link-area";

export const HelloWorld: FC = () => (
  <Stack>
    <p>hello world</p>
    <LinkArea href="/users">user page</LinkArea>
  </Stack>
);
