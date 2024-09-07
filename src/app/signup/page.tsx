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
  HStack,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Spacer,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function SimpleCard() {
  const validationSchema = Yup.object({
    firstName: Yup.string().min(2).required("First Name Required"),
    lastName: Yup.string().min(2).required("Last Name Required"),
    email: Yup.string()
      .required("Email Address cannot be empty")
      .email("Looks like this is not an email"),
    password: Yup.string().required("Password cannot be empty"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
          <Heading fontSize={"4xl"}>Sign up for your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            and hit the ground running!
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
              <HStack>
                <FormControl
                  id="firstName"
                  isInvalid={
                    formik.touched.firstName && formik.errors.firstName != ""
                  }
                >
                  <FormLabel>First Name</FormLabel>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <FormErrorMessage>
                      <WarningIcon mr="5px" />
                      {formik.errors.firstName}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="lastName"
                  isInvalid={
                    formik.touched.lastName && formik.errors.lastName != ""
                  }
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <FormErrorMessage>
                      <WarningIcon mr="5px" />
                      {formik.errors.lastName}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </HStack>
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
              <FormControl
                id="confirmPassword"
                isInvalid={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword != ""
                }
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                </InputGroup>

                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <FormErrorMessage>
                      <WarningIcon mr="5px" />
                      {formik.errors.confirmPassword}
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
                  Sign Up
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
