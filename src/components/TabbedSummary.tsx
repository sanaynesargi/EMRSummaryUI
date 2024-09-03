"use client";
import { CloseIcon } from "@chakra-ui/icons";
import {
  useTab,
  useMultiStyleConfig,
  Button,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Center,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import React, { useEffect, useReducer, useState } from "react";
import ReactMarkdown from "react-markdown";

interface TabbedSummaryProps {
  summaryMap: any;
  deleteTabName: Function;
}

export const TabbedSummary = ({
  summaryMap,
  deleteTabName,
}: TabbedSummaryProps) => {
  const [tabs, setTabs] = useState([]);
  const [tabMarkdown, setTabMarkdown] = useState([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const CustomTab = React.forwardRef((props: any, ref: any) => {
    const tabProps: any = useTab({ ...props, ref });

    const styles = useMultiStyleConfig("Tabs", tabProps);

    return (
      <Button
        __css={styles.tab}
        {...tabProps}
        justifyContent="center"
        alignItems="center"
      >
        {tabProps.children}
        <Box as="span" ml="5">
          <CloseIcon
            p="3px"
            borderRadius={"100%"}
            _hover={{ bg: "gray.100", opacity: 0.6 }}
            onClick={() => {
              let oldTabs = tabs;
              const key = tabs[props.index];

              oldTabs.splice(props.index, 1);
              setTabs(oldTabs);

              let oldTabMarkdown = tabMarkdown;
              oldTabMarkdown.splice(props.index, 1);
              setTabMarkdown(oldTabMarkdown);

              deleteTabName(key);
              forceUpdate();
            }}
          />
        </Box>
      </Button>
    );
  });

  useEffect(() => {
    let localTabs = [];
    let localTabMd = [];

    for (const key of Object.keys(summaryMap)) {
      localTabs.push(key);
      localTabMd.push(summaryMap[key]);
    }

    let f = localTabs.pop();
    let fm = localTabMd.pop();

    localTabs.splice(0, 0, f);
    localTabMd.splice(0, 0, fm);

    setTabs(localTabs);
    setTabMarkdown(localTabMd);
  }, [summaryMap]);

  return (
    <Tabs>
      <TabList>
        {tabs.map((name, index) => (
          <CustomTab index={index} key={index}>
            {name}
          </CustomTab>
        ))}
      </TabList>
      <TabPanels>
        {tabMarkdown.map((content, index) => (
          <TabPanel key={index}>
            <ReactMarkdown
              components={ChakraUIRenderer()}
              children={content}
              skipHtml
            />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
