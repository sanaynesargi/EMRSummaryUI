"use client";

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Grid,
  GridItem,
  Heading,
  Stack,
  StackDivider,
  VStack,
  Text,
  Button,
  HStack,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import TagInput from "../../components/tagInput";
import { useQuery } from "react-query";
import { fetchClients, fetchSummary } from "../../utils/requestManager";

interface Person {
  first_name: string;
  last_name: string;
  id: string;
}

export default function Home() {
  const [selectedIndividual, setSelectedIndividual] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("chakra-ui-color-mode", "dark");
  });

  const { data, status } = useQuery("clients", fetchClients);

  return (
    <Center w="100vw" h="100vh" bg="gray.900">
      <Grid
        h="95%"
        w="97%"
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(8, 1fr)"
        gap={6}
      >
        <GridItem
          rowSpan={1}
          colSpan={2}
          bg="gray.600"
          borderRadius="lg"
          gridRowStart="1"
          gridColumnStart="1"
        >
          <Center>
            <VStack>
              <HStack>
                <SingleDatepicker
                  name="date-input"
                  date={startDate}
                  onDateChange={setStartDate}
                />
                <Text>to</Text>
                <SingleDatepicker
                  name="date-input"
                  date={endDate}
                  onDateChange={setEndDate}
                />
              </HStack>
              <TagInput />
            </VStack>
          </Center>
        </GridItem>
        <GridItem
          rowSpan={5}
          colSpan={2}
          bg="gray.700"
          borderRadius="lg"
          gridRowStart="2"
          overflow="auto"
        >
          {status == "success" ? (
            <VStack w="100%">
              {data.data.map((person: Person, idx: number) => {
                const displayStr = `${person.first_name} ${person.last_name}`;
                return (
                  <Button
                    w="100%"
                    key={idx}
                    bg={
                      selectedIndividual == displayStr ? "#4E5766" : "#119DA4"
                    }
                    onClick={async () => {
                      setSelectedIndividual(displayStr);

                      const summaryResponse = await fetchSummary(person.id);
                      setIsSummaryLoading(true);

                      if (summaryResponse.error) {
                        // put a toast or something -> handle the error
                        return;
                      }

                      setSummary(summaryResponse.data);
                      setIsSummaryLoading(false);
                    }}
                  >
                    <Text fontWeight="bold">{displayStr}</Text>
                  </Button>
                );
              })}
            </VStack>
          ) : status == "loading" ? (
            <Center h="100%">
              <Spinner />
            </Center>
          ) : null}
        </GridItem>
        <GridItem rowSpan={5} colSpan={6} bg="gray.700" borderRadius="lg">
          <Card border="transparent">
            <CardHeader>
              <Heading size="md">Client Report - {selectedIndividual}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {summary.length == 0 ? (
                  <></>
                ) : !isSummaryLoading ? (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Summary
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {summary}
                    </Text>
                  </Box>
                ) : (
                  <Center>
                    <Spinner />
                  </Center>
                )}
                {/* <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Status Updates
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Check out the day-to-day status of your clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Anomalies
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed view of all anomalies found.
                  </Text>
                </Box> */}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          rowSpan={1}
          colSpan={6}
          bg="gray.700"
          borderRadius="lg"
        ></GridItem>
      </Grid>
    </Center>
  );
}
