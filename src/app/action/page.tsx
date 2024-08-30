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
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useQuery } from "react-query";
import { fetchClients, fetchSummary } from "../../../utils/requestManager";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import TagInput from "../../components/tagInput";
import { Layout } from "../../components/Layout";
import { NavBar } from "../../components/NavBar";
import { SUMMARY_PROMPT } from "../../../utils/workingPrompt";

interface Person {
  first_name: string;
  last_name: string;
  id: string;
}

const constructMarkdownString = (
  filters: string[],
  sections: { [key: string]: string }
): string => {
  console.log(filters);
  let markdown = "";
  let selectedFilters = filters;

  // If no filters are selected, use all section keys
  if (selectedFilters.length === 0) {
    selectedFilters = Object.keys(sections);
  }

  // Iterate over each section in the order of selected filters
  selectedFilters.forEach((section) => {
    if (sections.hasOwnProperty(section)) {
      console.log(section);
      // Add heading with the correct format
      markdown += `**${section}**:\n\n`;
      // Add the content of the section
      markdown += sections[section] + "\n\n";
    }
  });
  // Trim any trailing whitespace from the final markdown string
  return markdown;
};

export default function Home() {
  const [selectedIndividual, setSelectedIndividual] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [summary, setSummary] = useState({});
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("chakra-ui-color-mode", "dark");
  });

  const { data, status } = useQuery("clients", fetchClients);
  const [isFirstSummaryLoaded, setIsFirstSummaryLoaded] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [mdString, setMdString] = useState("");

  // only for debugging and development purposes
  const [currentPrompt, setCurrentPrompt] = useState(SUMMARY_PROMPT);

  const toast = useToast();

  const onFilterChange = (newFilters: any) => {
    let selected = [];

    for (const tag of allTags) {
      if (!newFilters.includes(tag)) {
        selected.push(tag);
      }
    }

    setMdString(constructMarkdownString(selected, summary));
  };

  const handlePromptChange = (e: any) => {
    let inputValue = e.target.value;
    setCurrentPrompt(inputValue);
  };

  return (
    <Layout>
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
              <TagInput
                filteredTags={filteredTags}
                setFilteredTags={setFilteredTags}
                onChange={onFilterChange}
              />
            </VStack>
          </Center>
        </GridItem>
        <GridItem
          rowSpan={5}
          colSpan={2}
          bg="gray.700"
          borderRadius="lg"
          gridRowStart="2"
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
                      setIsFirstSummaryLoaded(true);

                      const summaryResponse = await fetchSummary(
                        person.id,
                        currentPrompt
                      );
                      setIsSummaryLoading(true);

                      if (summaryResponse.error) {
                        // put a toast or something -> handle the error
                        toast({
                          title: "Something went wrong..",
                          description:
                            "We've had an error contacting the server.",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                        setIsFirstSummaryLoaded(false);
                        setIsSummaryLoading(false);
                        setSummary("");
                        setFilteredTags([]);
                        return;
                      }

                      setSummary(summaryResponse.data);
                      setFilteredTags(Object.keys(summaryResponse.data));
                      setAllTags(Object.keys(summaryResponse.data));
                      setMdString(
                        constructMarkdownString(
                          Object.keys(summaryResponse.data),
                          summaryResponse.data
                        )
                      );
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
        <GridItem
          rowSpan={5}
          colSpan={6}
          bg="gray.700"
          borderRadius="lg"
          overflowY="auto"
        >
          <Card border="transparent" overflowY="auto">
            <CardHeader>
              <Heading size="md">Client Report - {selectedIndividual}</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {isSummaryLoading && isFirstSummaryLoaded ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : !isSummaryLoading ? (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Summary
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <ReactMarkdown
                        components={ChakraUIRenderer()}
                        children={mdString}
                        skipHtml
                      />
                    </Text>
                  </Box>
                ) : null}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={6} bg="gray.700" borderRadius="lg">
          <Box ml="5px" mt="5px">
            <Text fontWeight="bold" color="teal.400" textDecor={"CaptionText"}>
              DEBUG ONLY: Prompt Edit (final version will be sent)
            </Text>
            <Textarea
              value={currentPrompt}
              onChange={handlePromptChange}
              placeholder={currentPrompt}
              size="sm"
            />
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
}
