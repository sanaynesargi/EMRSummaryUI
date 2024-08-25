"use client";

import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface NavProps {
  height: string;
}

export const NavBar = ({ height }: NavProps) => {
  const router = useRouter();

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
      <Button ml="auto" onClick={() => router.push("/login")}>
        Log In
      </Button>
      <Button
        colorScheme="teal"
        onClick={() => router.push("/signup")}
        mr="10px"
      >
        Sign Up
      </Button>
    </HStack>
  );
};
