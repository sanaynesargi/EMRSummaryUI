"use client";

import { WarningIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function SimpleCard() {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email Address cannot be empty")
      .email("Looks like this is not an email"),
    password: Yup.string().required("Password cannot be empty"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      console.log(values);
      router.push("/action");
    },
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Log In to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            and get to work!
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              <FormControl
                id="email"
                isInvalid={formik.touched.email && formik.errors.email != ""}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <FormErrorMessage>
                    <WarningIcon mr="5px" />
                    {formik.errors.email}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="password"
                isInvalid={
                  formik.touched.password && formik.errors.password != ""
                }
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormErrorMessage>
                    <WarningIcon mr="5px" />
                    {formik.errors.password}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox
                    name="rememberMe"
                    onChange={formik.handleChange}
                    isChecked={formik.values.rememberMe}
                  >
                    Remember me
                  </Checkbox>
                  <Text color={"blue.400"}>Forgot password?</Text>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                >
                  Log in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
