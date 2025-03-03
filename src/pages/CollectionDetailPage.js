import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Center,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useToast,
  Input,
  Textarea,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { FaEdit, FaArrowLeft, FaTrash, FaSave } from "react-icons/fa";
import { useCollections } from "../contexts/CollectionContext";
import Card from "../components/Card";
import CardDetail from "../components/CardDetail";
import { motion } from "framer-motion";

// Create a motion component for the card preview
const MotionBox = motion(Box);

const CollectionDetailPage = () => {
  const { id } = useParams();
  const { collections, removeCardFromCollection, updateCardInCollection } =
    useCollections();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (collections.length > 0) {
      const foundCollection = collections.find((c) => c.id === id);
      if (foundCollection) {
        setCollection(foundCollection);
      } else {
        // Collection not found, redirect to collections page
        toast({
          title: "Collection not found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/collections");
      }
      setLoading(false);
    }
  }, [collections, id, navigate, toast]);

  const handleViewDetails = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveFromCollection = (collectionId, cardId) => {
    removeCardFromCollection(collectionId, cardId);
    toast({
      title: "Card removed",
      description: "The card has been removed from your collection.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateQuantity = (collectionId, cardId, newQuantity) => {
    updateCardInCollection(collectionId, cardId, { quantity: newQuantity });
  };

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
        <Container maxW="container.xl">
          <Text>Collection not found.</Text>
        </Container>
      </Box>
    );
  }

  // Calculate total value
  const totalValue = collection.cards.reduce((sum, card) => {
    const price =
      card.tcgplayer?.prices?.holofoil?.market ||
      card.tcgplayer?.prices?.normal?.market ||
      card.tcgplayer?.prices?.reverseHolofoil?.market ||
      0;
    return sum + price * card.quantity;
  }, 0);

  return (
    <Box bg="background.primary" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="container.xl">
        <Flex mb={6} alignItems="center">
          <Button
            variant="ghost"
            onClick={() => navigate("/collections")}
            mr={4}
            color="white"
            _hover={{ bg: "background.secondary" }}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Back
          </Button>
          <Heading flex="1">{collection.name}</Heading>
          <Button
            as={RouterLink}
            to={`/collections/edit/${id}`}
            colorScheme="brand"
            _hover={{ textDecoration: "none" }}
            style={{ textDecoration: "none" }}
          >
            <FaEdit style={{ marginRight: "8px" }} />
            Edit Collection
          </Button>
        </Flex>

        <Text mb={6} fontSize="lg" color="gray.300">
          {collection.description || "No description provided."}
        </Text>

        <Box
          bg="background.secondary"
          p={5}
          borderRadius="lg"
          shadow="md"
          mb={8}
          borderColor="gray.700"
          borderWidth="1px"
        >
          <StatGroup>
            <Stat>
              <StatLabel color="gray.300">Total Cards</StatLabel>
              <StatNumber color="white">{collection.cards.length}</StatNumber>
              <StatHelpText color="gray.400">In collection</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel color="gray.300">Total Value</StatLabel>
              <StatNumber color="brand.300">
                ${totalValue.toFixed(2)}
              </StatNumber>
              <StatHelpText color="gray.400">Market price</StatHelpText>
            </Stat>
          </StatGroup>
        </Box>

        {collection.cards.length === 0 ? (
          <Box
            textAlign="center"
            py={10}
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.700"
            bg="background.secondary"
            position="relative"
            overflow="hidden"
            minHeight="300px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity="0.05"
              bgImage="url('/images/card-pattern.png')"
              bgPosition="center"
              bgSize="cover"
              bgRepeat="repeat"
            />
            <Heading as="h2" size="lg" mb={2} position="relative" zIndex="1">
              No Cards Yet
            </Heading>
            <Text color="gray.300" mb={6} position="relative" zIndex="1">
              Search for cards and add them to your collection.
            </Text>

            {/* Card Animation Container */}
            <Box
              height="120px"
              position="relative"
              overflow="hidden"
              borderRadius="md"
              mb={4}
              width="80%"
              maxWidth="400px"
              bg="background.tertiary"
            >
              {[1, 2, 3, 4, 5].map((index) => (
                <MotionBox
                  key={index}
                  position="absolute"
                  width="70px"
                  height="100px"
                  left={`${30 + index * 8}%`}
                  top="10px"
                  transformOrigin="bottom center"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    y: [100, 0, 0, 100],
                    rotate: [
                      0,
                      -15 + (index * 30) / 4,
                      -15 + (index * 30) / 4,
                      0,
                    ],
                    opacity: [0, 1, 1, 0],
                    transition: {
                      duration: 3,
                      delay: index * 0.08,
                      repeat: Infinity,
                      repeatDelay: 1,
                    },
                  }}
                >
                  <Box
                    height="100%"
                    width="100%"
                    borderRadius="md"
                    boxShadow="dark-lg"
                    bg="gray.700"
                    opacity="0.7"
                  />
                </MotionBox>
              ))}
            </Box>

            <Button
              as={RouterLink}
              to="/search"
              colorScheme="brand"
              size="lg"
              _hover={{ textDecoration: "none" }}
              style={{ textDecoration: "none" }}
              position="relative"
              zIndex="1"
              mt={4}
            >
              Search Cards
            </Button>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
            spacing={6}
          >
            {collection.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                inCollection={true}
                collectionId={collection.id}
                collections={collections}
                onViewDetails={handleViewDetails}
                onRemoveFromCollection={handleRemoveFromCollection}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </SimpleGrid>
        )}

        {selectedCard && (
          <CardDetail
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            card={selectedCard}
            collections={collections}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
      </Container>
    </Box>
  );
};

export default CollectionDetailPage;
