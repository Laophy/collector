import React from "react";
import { Box, Container, Heading } from "@chakra-ui/react";
import CollectionForm from "../components/CollectionForm";

const NewCollectionPage = () => {
  return (
    <Box bg="background.primary" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="container.md">
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="white">
          Create New Collection
        </Heading>
        <CollectionForm />
      </Container>
    </Box>
  );
};

export default NewCollectionPage;
