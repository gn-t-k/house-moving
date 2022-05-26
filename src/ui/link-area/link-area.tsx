import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC, ReactNode } from "react";

type Props = {
  href: string;
  isExternal?: boolean;
  children: ReactNode;
};

export const LinkArea: FC<Props> = ({ href, isExternal = false, children }) => (
  <NextLink href={href} passHref>
    <Link isExternal={isExternal}>{children}</Link>
  </NextLink>
);
