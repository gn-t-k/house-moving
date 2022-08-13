import { Stack, Box, Image, Text, Button } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  userName: string;
  userIcon: string;
  logout: () => Promise<void>;
};
export const TraineePage: FC<Props> = ({ userName, userIcon, logout }) => (
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
