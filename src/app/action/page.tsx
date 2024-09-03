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
import { cacheSummaryMarkdown, retreiveSummaryMarkdown } from "../actions";
import { splitMarkdownByHeadings } from "../../../utils/splitMarkdownByHeadings";
import { TabbedSummary } from "../../components/TabbedSummary";

interface Person {
  first_name: string;
  last_name: string;
  id: string;
}

const countAsterisksInStr = (test: string) => {
  let count = 0;
  for (const c of test) {
    if (c == "*") {
      count++;
    }
  }

  return count;
};

const constructMarkdownString = (
  filters: string[],
  sections: { [key: string]: string }
): string => {
  let markdown = "";
  let selectedFilters = filters;

  // If no filters are selected, use all section keys
  if (selectedFilters.length === 0) {
    selectedFilters = Object.keys(sections);
  }

  // Iterate over each section in the order of selected filters
  selectedFilters.forEach((section) => {
    if (sections.hasOwnProperty(section)) {
      let asts = countAsterisksInStr(section);
      // Add heading with the correct format
      if (section.at(-1) == "*") {
        let extraAstsAtEnd = asts - 2;
        let normalHeading = `**${
          extraAstsAtEnd == 0 ? section : section.slice(0, -extraAstsAtEnd)
        }:\n\n`;

        markdown += normalHeading;
      } else {
        markdown += `**${section}**:\n\n`;
      }
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

  // setting up tab -> markdown array for tab-based rendering
  const [nameSummaryMap, setNameSummaryMap] = useState({});
  const [selectedTab, setSelectedTab] = useState("");
  const [clearTags, setClearTags] = useState(0); // count of clear tags
  const [tabHistory, setTabHistory] = useState([]);
  const [ogMd, setOgMd] = useState({});

  // only for debugging and development purposes
  const [currentPrompt, setCurrentPrompt] = useState(SUMMARY_PROMPT);

  const toast = useToast();

  const onFilterChange = (newFilters: any) => {
    console.log("filter called + " + selectedTab);
    let selected = [];

    for (const tag of allTags) {
      if (!newFilters.includes(tag)) {
        selected.push(tag);
      }
    }

    setMdString(constructMarkdownString(selected, summary));

    let map = nameSummaryMap;
    setNameSummaryMap({});

    map[selectedTab] = constructMarkdownString(selected, summary);
    setNameSummaryMap(map);
  };

  const onNewTab = (allTags: any) => {
    console.log("on new tab claled: " + tabHistory);
    if (tabHistory.length == 0) {
      return;
    }

    nameSummaryMap[tabHistory[0]] = ogMd[tabHistory[0]];
  };

  const handlePromptChange = (e: any) => {
    let inputValue = e.target.value;
    setCurrentPrompt(inputValue);
  };

  const onTabDeleted = (name: string) => {
    let oldMap = nameSummaryMap;
    delete oldMap[name];
    setNameSummaryMap(oldMap);
  };

  const onTabSwitch = (name: string) => {
    if (!name) {
      return;
    }

    const sections = splitMarkdownByHeadings(nameSummaryMap[name]);

    setClearTags(clearTags + 1);
    setSummary(sections);
    setFilteredTags(Object.keys(sections));
    setAllTags(Object.keys(sections));
    setSelectedTab(name);

    let hist = tabHistory;

    if (tabHistory[tabHistory.length - 1] == name) {
      return;
    }
    hist.push(name);

    if (hist.length == 3) {
      hist.splice(0, 1);
    }
    setTabHistory(hist);
  };

  return (
    <Layout>
      <Grid
        h="95%"
        w="97%"
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(8, 1fr)"
        gap={6}
        suppressHydrationWarning
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
                allTags={allTags}
                clearTags={clearTags}
                onNewTab={onNewTab}
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

                      setIsSummaryLoading(true);
                      //setMdString("");
                      setSummary({});

                      // see if the markdown is cached
                      const cachedMarkdown: string =
                        await retreiveSummaryMarkdown(displayStr); // not selected individual

                      if (cachedMarkdown) {
                        console.log("Cache Hit: " + displayStr);
                        console.log("Text: " + cachedMarkdown);
                        console.log("\n\n");
                      } else {
                        console.log("Cache Miss: " + displayStr);
                      }

                      if (cachedMarkdown) {
                        const sections =
                          splitMarkdownByHeadings(cachedMarkdown);

                        setSummary(sections);
                        setFilteredTags(Object.keys(sections));
                        setAllTags(Object.keys(sections));

                        const initialMd = constructMarkdownString(
                          Object.keys(sections),
                          sections
                        );

                        setNameSummaryMap({
                          ...nameSummaryMap,
                          [displayStr]: initialMd,
                        });

                        setMdString(initialMd);
                        setIsSummaryLoading(false);

                        setOgMd({
                          ...ogMd,
                          [displayStr]: initialMd,
                        });
                        return;
                      }

                      const summaryResponse = await fetchSummary(
                        person.id,
                        currentPrompt
                      );

                      if (summaryResponse.error) {
                        // put a toast or something -> handle the error
                        toast({
                          title: "Something went wrong..",
                          description: summaryResponse.error,
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

                      // A little messy, but set all states
                      setSummary(summaryResponse.data);
                      setFilteredTags(Object.keys(summaryResponse.data));
                      setAllTags(Object.keys(summaryResponse.data));

                      const initialMd = constructMarkdownString(
                        Object.keys(summaryResponse.data),
                        summaryResponse.data
                      );

                      // cache the current markdown in Redis for retreival later
                      await cacheSummaryMarkdown(displayStr, initialMd);
                      setNameSummaryMap({
                        ...nameSummaryMap,
                        [displayStr]: initialMd,
                      });
                      setOgMd({
                        ...ogMd,
                        [displayStr]: initialMd,
                      });
                      setMdString(initialMd);
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
                <Box>
                  <Heading size="xs" textTransform="uppercase" mb="2">
                    {Object.keys(nameSummaryMap).length == 1
                      ? "Patient Summary"
                      : "Patient Summaries"}
                  </Heading>

                  {isFirstSummaryLoaded && isSummaryLoading ? (
                    <Center>
                      <Spinner />
                    </Center>
                  ) : (
                    <TabbedSummary
                      summaryMap={nameSummaryMap}
                      deleteTabName={onTabDeleted}
                      onTabSwitch={onTabSwitch}
                    />
                  )}
                </Box>
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
