import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Text,
  HStack,
} from "@chakra-ui/react";

interface TagInputProps {
  filteredTags: any[];
  setFilteredTags: Function;
  onChange: Function;
}

const TagInput = ({
  filteredTags,
  setFilteredTags,
  onChange,
}: TagInputProps) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInputValue("");

      let newTags = filteredTags;
      let index = newTags.indexOf(tag);
      newTags.splice(index, 1);

      setFilteredTags(newTags);
      onChange(newTags);

      onClose();
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));

    let newTags = filteredTags;
    newTags.push(tagToDelete);

    onChange(newTags);
    setFilteredTags(newTags);
  };

  return (
    <Box>
      <HStack>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            borderRadius="full"
            variant="solid"
            colorScheme="blue"
          >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => handleDeleteTag(tag)} />
          </Tag>
        ))}
      </HStack>

      <Button mt={4} onClick={onOpen}>
        Add Filter
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Filter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter tag" />
            {filteredTags.length > 0 && (
              <List spacing={1} mt={2}>
                {filteredTags.map((tag, index) => (
                  <ListItem
                    key={index}
                    cursor="pointer"
                    onClick={() => handleAddTag(tag)}
                    _hover={{ backgroundColor: "gray.800" }}
                    p={2}
                    borderRadius="md"
                  >
                    <Text>{tag}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TagInput;
