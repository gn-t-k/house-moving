import { Stack, Box, Image, Text, Button } from "@chakra-ui/react";
import { FC } from "react";

type Props =
  | ({
      isLoggedIn: true;
    } & LoggedInProps)
  | ({
      isLoggedIn: false;
    } & LoggedOutProps);
export const AccountPage: FC<Props> = (props) =>
  props.isLoggedIn ? (
    <LoggedIn
      userName={props.userName}
      userIcon={props.userIcon}
      logout={props.logout}
    />
  ) : (
    <LoggedOut login={props.login} />
  );

type LoggedInProps = {
  userName: string;
  userIcon: string;
  logout: () => Promise<void>;
};
const LoggedIn: FC<LoggedInProps> = ({ userName, userIcon, logout }) => (
  <Stack direction="row">
    <Box>
      <Image borderRadius="full" src={userIcon} alt={userName} />
    </Box>
    <Box>
      <Text>{userName}</Text>
    </Box>
    <Box>
      <Button onClick={logout}>ログアウト</Button>
    </Box>
  </Stack>
);

type LoggedOutProps = {
  login: () => Promise<void>;
};
const LoggedOut: FC<LoggedOutProps> = ({ login }) => (
  <Button onClick={login}>ログイン</Button>
);
