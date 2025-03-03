import React, { useState } from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Badge,
  Button,
  IconButton,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaMinus, FaTrash, FaEye, FaChevronDown } from "react-icons/fa";

const Card = ({
  card,
  inCollection = false,
  collectionId = null,
  collections = [],
  onAddToCollection,
  onRemoveFromCollection,
  onUpdateQuantity,
  onViewDetails,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToast();

  // Get the quantity if the card is in a collection
  const quantity = inCollection
    ? collections
        .find((c) => c.id === collectionId)
        ?.cards.find((c) => c.id === card.id)?.quantity || 1
    : 1;

  // Use dark theme colors
  const cardBg = "background.secondary";
  const cardHoverBg = "background.tertiary";
  const priceColor = "brand.300";
  const textColor = "white";
  const subTextColor = "gray.300";

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : "N/A";
  };

  // Get the market price from tcgplayer data
  const getMarketPrice = () => {
    if (!card.tcgplayer || !card.tcgplayer.prices) return "N/A";

    const prices = card.tcgplayer.prices;
    return formatPrice(
      prices.holofoil?.market ||
        prices.normal?.market ||
        prices.reverseHolofoil?.market ||
        prices.firstEdition?.market ||
        prices.unlimited?.market ||
        0
    );
  };

  const handleAddToCollection = (selectedCollectionId) => {
    setIsAdding(true);
    try {
      onAddToCollection(selectedCollectionId, card, 1);
      toast({
        title: "Card added",
        description: `${card.name} has been added to your collection.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card to collection.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromCollection = () => {
    if (onRemoveFromCollection && collectionId) {
      onRemoveFromCollection(collectionId, card.id);
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (onUpdateQuantity && collectionId) {
      onUpdateQuantity(collectionId, card.id, newQuantity);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg={cardBg}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg",
        bg: cardHoverBg,
      }}
      height="100%"
      display="flex"
      flexDirection="column"
      borderColor="gray.700"
      role="group"
    >
      <Box position="relative" overflow="hidden">
        <Image
          src={card.images.small}
          alt={card.name}
          width="100%"
          transition="transform 0.3s ease"
          _groupHover={{ transform: "scale(1.05)" }}
        />
        {onViewDetails && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.7)"
            justify="center"
            align="center"
            opacity="0"
            transition="opacity 0.3s ease"
            _groupHover={{ opacity: 1 }}
          >
            <Button
              colorScheme="brand"
              size="sm"
              onClick={() => onViewDetails(card)}
              leftIcon={<FaEye />}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              View Details
            </Button>
          </Flex>
        )}
      </Box>

      <VStack p={3} spacing={2} align="stretch" flex="1">
        <Heading as="h3" size="sm" color={textColor} noOfLines={1}>
          {card.name}
        </Heading>
        <Text fontSize="sm" color={subTextColor}>
          {card.set.name}
        </Text>
        {card.rarity && (
          <Badge alignSelf="flex-start" colorScheme="brand" variant="solid">
            {card.rarity}
          </Badge>
        )}
        <Text fontSize="md" fontWeight="bold" color={priceColor} mt="auto">
          Market: {getMarketPrice()}
        </Text>
      </VStack>

      {inCollection ? (
        <Flex
          p={2}
          borderTop="1px"
          borderColor="gray.700"
          justify="space-between"
          align="center"
        >
          <HStack spacing={1}>
            <IconButton
              aria-label="Decrease quantity"
              size="xs"
              variant="ghost"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              isDisabled={quantity <= 1}
              color="white"
              _hover={{ bg: "background.primary" }}
            >
              <FaMinus />
            </IconButton>
            <Text fontWeight="medium" color="white">
              {quantity}
            </Text>
            <IconButton
              aria-label="Increase quantity"
              size="xs"
              variant="ghost"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              color="white"
              _hover={{ bg: "background.primary" }}
            >
              <FaPlus />
            </IconButton>
          </HStack>
          <IconButton
            aria-label="Remove card"
            size="xs"
            colorScheme="red"
            variant="ghost"
            onClick={handleRemoveFromCollection}
            _hover={{ bg: "background.primary" }}
          >
            <FaTrash />
          </IconButton>
        </Flex>
      ) : (
        <Flex p={2} borderTop="1px" borderColor="gray.700" justify="center">
          {collections.length > 0 ? (
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="brand"
                size="sm"
                width="100%"
                isLoading={isAdding}
                rightIcon={<FaChevronDown />}
                leftIcon={<FaPlus />}
                py={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                Add Card
              </MenuButton>
              <MenuList>
                {collections.map((collection) => (
                  <MenuItem
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection.id)}
                  >
                    {collection.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Button
              colorScheme="brand"
              size="sm"
              width="100%"
              as="a"
              href="/collections/new"
              py={1}
              leftIcon={<FaPlus />}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              New Collection
            </Button>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default Card;
