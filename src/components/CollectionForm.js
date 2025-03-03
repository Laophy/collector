import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Stack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useCollections } from "../contexts/CollectionContext";
import { useNavigate } from "react-router-dom";

const CollectionForm = ({ collection = null }) => {
  const { createCollection, updateCollection } = useCollections();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
  });

  const [errors, setErrors] = useState({});

  // Use dark theme colors
  const bgColor = "background.secondary";
  const borderColor = "gray.700";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (collection) {
        updateCollection(collection.id, formData);
      } else {
        createCollection(formData.name, formData.description);
      }
      navigate("/collections");
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="md"
      width="100%"
      maxWidth="600px"
      mx="auto"
    >
      <Heading size="lg" mb={6} color="white">
        {collection ? "Edit Collection" : "Create New Collection"}
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel color="gray.300">Collection Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter collection name"
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "brand.400" }}
              _focus={{
                borderColor: "brand.300",
                boxShadow: "0 0 0 1px #ff6868",
              }}
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel color="gray.300">Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter collection description"
              rows={4}
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "brand.400" }}
              _focus={{
                borderColor: "brand.300",
                boxShadow: "0 0 0 1px #ff6868",
              }}
            />
          </FormControl>

          <Flex justify="space-between" mt={4}>
            <Button
              variant="outline"
              onClick={() => navigate("/collections")}
              borderColor="gray.600"
              color="white"
              _hover={{ bg: "background.primary", borderColor: "gray.500" }}
            >
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit">
              {collection ? "Update" : "Create"}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default CollectionForm;
