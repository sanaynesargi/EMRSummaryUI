"use client";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useRouter } from "next/navigation";

export default function SplitScreen() {
  const router = useRouter();

  return (
    <Layout>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Summarize
              </Text>
              <br />{" "}
              <Text color={"blue.400"} as={"span"}>
                Gain Insights
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              The record summary tool is an extremely useful resource for
              propsoing treatment while saving time and labor. It&apos;s perfect
              for all types of medical agencies.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => router.push("/action")}
              >
                Get Started
              </Button>
              <Button rounded={"full"}>How It Works</Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex
          justify="flex-end"
          align="center"
          p={0} // Remove padding if unnecessary
          m={0} // Remove margin if unnecessary
          w="40vw"
        >
          <Image
            alt={"Login Image"}
            objectFit={"fill"}
            src={"/title.png"}
            borderRadius="full"
          />
        </Flex>
      </Stack>
    </Layout>
  );
}
