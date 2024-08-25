"use client";

import { Center, VStack } from "@chakra-ui/react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: any;
}

export const Layout = ({ children }) => {
  const navHeight = "55px";

  return (
    <VStack overflow="clip" h="100vh">
      <NavBar height={navHeight} />
      <Center
        w="100vw"
        h="110vh"
        bg="gray.900"
        overflow="hidden"
        marginTop={navHeight}
      >
        {children}
      </Center>
    </VStack>
  );
};
