import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Badge,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaChartLine } from "react-icons/fa";

const CollectionSummary = ({ collection, onEdit, onDelete }) => {
  // Use fixed colors instead of dynamic color mode
  const bgColor = "white";
  const borderColor = "gray.200";
  const textColor = "gray.600";

  // Calculate total value
  const totalValue = collection.cards.reduce((sum, card) => {
    const price = parseFloat(card.marketPrice) || 0;
    return sum + price * card.quantity;
  }, 0);

  // Calculate rarity distribution
  const rarityDistribution = collection.cards.reduce((acc, card) => {
    const rarity = card.rarity || "Unknown";
    if (!acc[rarity]) {
      acc[rarity] = 0;
    }
    acc[rarity] += card.quantity;
    return acc;
  }, {});

  // Calculate total cards and unique sets
  const totalCards = collection.cards.reduce(
    (sum, card) => sum + card.quantity,
    0
  );
  const uniqueSets = new Set(collection.cards.map((card) => card.set.name))
    .size;

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      shadow="md"
      mb={6}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg">
          {collection.name}
        </Heading>
        <Flex>
          <Tooltip label="Edit Collection">
            <Button
              size="sm"
              mr={2}
              onClick={() => onEdit(collection)}
              aria-label="Edit Collection"
            >
              <FaEdit style={{ marginRight: "8px" }} />
              Edit
            </Button>
          </Tooltip>
          <Tooltip label="Delete Collection">
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => onDelete(collection.id)}
              aria-label="Delete Collection"
            >
              <FaTrash style={{ marginRight: "8px" }} />
              Delete
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      <Text color={textColor} mb={4}>
        {collection.description || "No description provided."}
      </Text>

      <StatGroup mb={6}>
        <Stat>
          <StatLabel>Total Cards</StatLabel>
          <StatNumber>{totalCards}</StatNumber>
          <StatHelpText>In collection</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Value</StatLabel>
          <StatNumber>${totalValue.toFixed(2)}</StatNumber>
          <StatHelpText>Market price</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Sets</StatLabel>
          <StatNumber>{uniqueSets}</StatNumber>
          <StatHelpText>Unique sets</StatHelpText>
        </Stat>
      </StatGroup>

      {Object.keys(rarityDistribution).length > 0 && (
        <Box>
          <Text fontWeight="bold" mb={2}>
            Rarity Distribution:
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
            {Object.entries(rarityDistribution).map(([rarity, count]) => (
              <Badge
                key={rarity}
                colorScheme={
                  rarity === "Rare Holo" || rarity === "Rare Ultra"
                    ? "purple"
                    : rarity === "Rare"
                    ? "blue"
                    : rarity === "Uncommon"
                    ? "green"
                    : "gray"
                }
                p={2}
                borderRadius="md"
                textAlign="center"
              >
                {rarity}: {count}
              </Badge>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default CollectionSummary;
