"use client";

import { Box, Button, HStack, Stack } from "@chakra-ui/react";

interface NavProps {
  height: string;
}

export const NavBar = ({ height }: NavProps) => {
  return (
    <HStack
      bg="#008080"
      w="100vw"
      h={height}
      boxShadow="base"
      position="fixed"
      top={0}
      left={0}
      zIndex={10}
    >
      <Button ml="auto">Log In</Button>
      <Button colorScheme="teal">Sign Up</Button>
    </HStack>
  );
};
