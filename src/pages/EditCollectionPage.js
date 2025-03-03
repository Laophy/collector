import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import CollectionForm from "../components/CollectionForm";
import { useCollections } from "../contexts/CollectionContext";

const EditCollectionPage = () => {
  const { id } = useParams();
  const { collections } = useCollections();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (collections.length > 0) {
      const foundCollection = collections.find((c) => c.id === id);
      if (foundCollection) {
        setCollection(foundCollection);
      } else {
        // Collection not found, redirect to collections page
        navigate("/collections");
      }
      setLoading(false);
    }
  }, [collections, id, navigate]);

  if (loading) {
    return (
      <Center h="calc(100vh - 64px)">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!collection) {
    return (
      <Box bg="background.primary" minH="calc(100vh - 64px)" py={8}>
        <Container maxW="container.md">
          <Text color="white">Collection not found.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="background.primary" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="container.md">
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="white">
          Edit Collection
        </Heading>
        <CollectionForm collection={collection} />
      </Container>
    </Box>
  );
};

export default EditCollectionPage;
