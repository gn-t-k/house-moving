import { Stack, Button } from "@chakra-ui/react";
import { FC } from "react";
import { LinkArea } from "@/ui/link-area/link-area";

type Props =
  | {
      isLoggedIn: true;
      userName: string;
      logout: () => void;
    }
  | {
      isLoggedIn: false;
      login: () => void;
    };

export const HelloWorld: FC<Props> = (props) =>
  props.isLoggedIn ? (
    <Stack>
      <p>hello {props.userName}</p>
      <LinkArea href="/users">user page</LinkArea>
      <Button onClick={props.logout}>logout</Button>
    </Stack>
  ) : (
    <Button onClick={props.login}>login</Button>
  );
