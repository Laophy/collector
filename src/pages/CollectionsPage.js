import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  Stack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Image,
  HStack,
} from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit, FaChartLine } from "react-icons/fa";
import { useCollections } from "../contexts/CollectionContext";
import { motion } from "framer-motion";

// Create a motion component for the card preview
const MotionBox = motion(Box);

const CollectionCard = ({ collection, onDelete }) => {
  const { name, description, cards } = collection;
  const cardBg = "background.secondary";
  const borderColor = "gray.700";
  const hoverBg = "background.tertiary";
  const textColor = "gray.300";
  const [isHovered, setIsHovered] = useState(false);

  // Calculate total value
  const totalValue = cards.reduce((sum, card) => {
    const price =
      card.tcgplayer?.prices?.holofoil?.market ||
      card.tcgplayer?.prices?.normal?.market ||
      card.tcgplayer?.prices?.reverseHolofoil?.market ||
      0;
    return sum + price * card.quantity;
  }, 0);

  // Get up to 5 cards to display in the preview
  const previewCards = cards.slice(0, Math.min(5, cards.length));

  // Calculate positions for the fan effect
  const getCardPosition = (index, total) => {
    // Instead of centering, distribute cards evenly across the container
    // Leave some padding on the edges (10% on each side)
    const leftPadding = 10;
    const rightPadding = 10;
    const usableWidth = 100 - leftPadding - rightPadding;

    // For a single card, center it
    if (total <= 1) {
      return "50%";
    }

    // Otherwise distribute evenly
    const position = leftPadding + (index * usableWidth) / (total - 1);
    return `${position}%`;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "dark-lg",
        bg: hoverBg,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      position="relative"
    >
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading as="h3" size="md" isTruncated color="white">
            {name}
          </Heading>
          <Badge colorScheme="brand" fontSize="0.8em">
            {cards.length} cards
          </Badge>
        </Flex>

        <Text noOfLines={2} mb={4} color={textColor}>
          {description || "No description provided."}
        </Text>

        <StatGroup mb={6}>
          <Stat>
            <StatLabel color="gray.300">Total Cards</StatLabel>
            <StatNumber color="white">{cards.length}</StatNumber>
            <StatHelpText color="gray.400">In collection</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel color="gray.300">Total Value</StatLabel>
            <StatNumber color="brand.300">${totalValue.toFixed(2)}</StatNumber>
            <StatHelpText color="gray.400">Market price</StatHelpText>
          </Stat>
        </StatGroup>

        {/* Card Preview Animation */}
        <Box
          height="120px"
          position="relative"
          overflow="hidden"
          borderRadius="md"
          mb={4}
          bg="background.tertiary"
        >
          {cards.length > 0
            ? previewCards.map((card, index) => (
                <MotionBox
                  key={card.id}
                  position="absolute"
                  width="70px"
                  height="100px"
                  left={getCardPosition(index, previewCards.length)}
                  top="10px"
                  transformOrigin="bottom center"
                  initial={{
                    y: 100,
                    rotate: 0,
                    opacity: 0,
                    x: "-50%", // Center the card on its left position
                  }}
                  animate={{
                    y: isHovered ? 0 : 100,
                    rotate: isHovered
                      ? -10 + (index * 20) / (previewCards.length - 1 || 1)
                      : 0,
                    opacity: isHovered ? 1 : 0,
                    x: "-50%", // Center the card on its left position
                    transition: {
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: "easeOut",
                    },
                  }}
                  whileHover={{
                    y: -10,
                    zIndex: 10,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Image
                    src={card.images?.small}
                    alt={card.name}
                    height="100%"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="dark-lg"
                  />
                </MotionBox>
              ))
            : // Placeholder animation for empty collections
              [1, 2, 3, 4, 5].map((index) => (
                <MotionBox
                  key={index}
                  position="absolute"
                  width="70px"
                  height="100px"
                  left={getCardPosition(index, 5)}
                  top="10px"
                  transformOrigin="bottom center"
                  initial={{
                    y: 100,
                    rotate: 0,
                    opacity: 0,
                    x: "-50%", // Center the card on its left position
                  }}
                  animate={{
                    y: isHovered ? 0 : 100,
                    rotate: isHovered ? -10 + (index * 20) / 4 : 0,
                    opacity: isHovered ? 0.7 : 0,
                    x: "-50%", // Center the card on its left position
                    transition: {
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: "easeOut",
                    },
                  }}
                >
                  <Box
                    height="100%"
                    width="100%"
                    borderRadius="md"
                    boxShadow="dark-lg"
                    bg="gray.700"
                  />
                </MotionBox>
              ))}
          {cards.length === 0 && !isHovered && (
            <Text color="gray.400" textAlign="center" py={4}>
              No cards in this collection
            </Text>
          )}
        </Box>
      </Box>

      <Flex
        borderTop="1px"
        borderColor={borderColor}
        p={3}
        justify="space-between"
      >
        <Button
          as={RouterLink}
          to={`/collections/${collection.id}`}
          size="sm"
          colorScheme="brand"
          _hover={{ textDecoration: "none" }}
          _focus={{
            boxShadow: "none",
            outline: "none",
          }}
          _focusVisible={{
            boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
          }}
          style={{ textDecoration: "none" }}
        >
          <FaEdit style={{ marginRight: "8px" }} />
          View & Edit
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          variant="ghost"
          onClick={() => onDelete(collection.id)}
          _hover={{ bg: "background.primary" }}
          _focus={{
            boxShadow: "none",
            outline: "none",
          }}
          _focusVisible={{
            boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
          }}
        >
          <FaTrash style={{ marginRight: "8px" }} />
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

const CollectionsPage = () => {
  const { collections, deleteCollection } = useCollections();
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = "background.primary";
  const textColor = "gray.300";

  const handleDeleteClick = (id) => {
    const collection = collections.find((c) => c.id === id);
    setCollectionToDelete(collection);
    onOpen();
  };

  const handleDeleteConfirm = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      setCollectionToDelete(null);
      onClose();
      toast({
        title: "Collection Deleted",
        description: `The collection "${collectionToDelete.name}" has been deleted.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={bgColor} minH="calc(100vh - 80px)">
      <Container maxW="container.xl" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="white">
            Your Collections
          </Heading>
          <Button
            as={RouterLink}
            to="/collections/new"
            colorScheme="brand"
            leftIcon={<FaPlus />}
            _hover={{ textDecoration: "none" }}
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
            }}
            style={{ textDecoration: "none" }}
          >
            New Collection
          </Button>
        </Flex>

        {collections.length === 0 ? (
          <Box
            textAlign="center"
            py={10}
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.700"
            bg="background.secondary"
          >
            <FaChartLine
              size={48}
              color="#ff6868"
              style={{ margin: "0 auto 16px" }}
            />
            <Heading as="h2" size="lg" mb={2} color="white">
              No Collections Yet
            </Heading>
            <Text color={textColor} mb={6}>
              Start by creating your first collection to track your Pokémon
              cards.
            </Text>
            <Button
              as={RouterLink}
              to="/collections/new"
              colorScheme="brand"
              size="lg"
              leftIcon={<FaPlus />}
              _hover={{ textDecoration: "none" }}
              _focus={{
                boxShadow: "none",
                outline: "none",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
              }}
              style={{ textDecoration: "none" }}
            >
              Create Your First Collection
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={handleDeleteClick}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="background.secondary" color="white">
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
            }}
          />
          <ModalBody>
            <Text color="gray.300">
              Are you sure you want to delete this collection? This action
              cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              color="white"
              _hover={{ bg: "background.primary" }}
              _focus={{
                boxShadow: "none",
                outline: "none",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirm}
              _focus={{
                boxShadow: "none",
                outline: "none",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CollectionsPage;
