import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Image,
  Flex,
  useToast,
  Select,
  VStack,
  HStack,
  Spinner,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Divider,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  FaRandom,
  FaInfoCircle,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { getSets } from "../services/api";
import { motion } from "framer-motion";
import useSound from "../hooks/useSound";

// Card rarity distribution based on real TCG packs
const RARITY_DISTRIBUTION = {
  common: 0.7, // 70% chance
  uncommon: 0.2, // 20% chance
  rare: 0.075, // 7.5% chance
  "rare holo": 0.02, // 2% chance
  "rare ultra": 0.004, // 0.4% chance
  "rare secret": 0.001, // 0.1% chance
};

// Number of cards per pack
const CARDS_PER_PACK = 10;

// Animation variants for cards
const cardVariants = {
  initial: {
    rotateY: 180,
    opacity: 0,
    scale: 0.8,
  },
  flipped: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
    transition: { duration: 0.2 },
  },
  revealed: {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0px 0px 0px rgba(0, 0, 0, 0.2)",
      "0px 15px 25px rgba(0, 0, 0, 0.5)",
      "0px 5px 15px rgba(0, 0, 0, 0.3)",
    ],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

// Pack opening animation variants
const packVariants = {
  initial: {
    scale: 1,
    y: 0,
    opacity: 1,
  },
  opening: {
    scale: 1.2,
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const PackOpeningPage = () => {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [packOpening, setPackOpening] = useState(false);
  const [cards, setCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [packImage, setPackImage] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState(null);

  // Sound sources
  const soundSources = [
    // Card shuffling/flipping sounds
    "https://cdn.freesound.org/previews/564/564128_1338578-lq.mp3", // Playing cards on wooden table
    "https://cdn.freesound.org/previews/240/240776_4107740-lq.mp3", // Card shuffle
    "https://cdn.freesound.org/previews/240/240777_4107740-lq.mp3", // Card dealing
    "https://cdn.freesound.org/previews/108/108394_1338578-lq.mp3", // Card flick
    // Fallback to other sounds if card sounds don't work
    "https://assets.mixkit.co/sfx/preview/mixkit-opening-a-soda-can-2355.mp3",
    "https://assets.mixkit.co/sfx/preview/mixkit-plastic-bag-rustling-1943.mp3",
  ];

  // Initialize sound hook
  const { isEnabled, toggle, play, playOverlap } = useSound(soundSources);

  // Fetch sets on component mount
  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        const response = await getSets();
        // Filter sets that have pack art
        const setsWithPacks = response.data.filter(
          (set) => set.images && set.images.logo && set.images.symbol
        );
        setSets(setsWithPacks);

        if (setsWithPacks.length > 0) {
          setSelectedSet(setsWithPacks[0].id);
          setPackImage(setsWithPacks[0].images.logo);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sets:", error);
        toast({
          title: "Error",
          description: "Failed to load card sets. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchSets();
  }, [toast]);

  // Handle set selection change
  const handleSetChange = (e) => {
    const setId = e.target.value;
    setSelectedSet(setId);

    // Update pack image
    const selectedSetData = sets.find((set) => set.id === setId);
    if (selectedSetData && selectedSetData.images) {
      setPackImage(selectedSetData.images.logo);
    }
  };

  // Simulate opening a pack
  const openPack = async () => {
    if (!selectedSet) {
      toast({
        title: "No Set Selected",
        description: "Please select a card set first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setPackOpening(true);
      setRevealedCards([]);

      // Play pack opening sound
      if (isEnabled) {
        play(0.7).catch((err) =>
          console.warn("Failed to play pack opening sound:", err)
        );
      }

      // Simulate API call to get cards from the selected set
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}&pageSize=100`,
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_POKEMON_API_KEY,
          },
        }
      );

      const data = await response.json();
      const cardsFromSet = data.data;

      if (!cardsFromSet || cardsFromSet.length === 0) {
        throw new Error("No cards found in this set");
      }

      // Group cards by rarity and type
      const cardsByRarity = {};
      const energyCards = [];

      cardsFromSet.forEach((card) => {
        // Check if it's an energy card
        const isEnergy = card.supertype === "Energy";

        if (isEnergy) {
          energyCards.push(card);
        } else {
          const rarity = card.rarity ? card.rarity.toLowerCase() : "common";
          if (!cardsByRarity[rarity]) {
            cardsByRarity[rarity] = [];
          }
          cardsByRarity[rarity].push(card);
        }
      });

      // Generate pack with appropriate rarity distribution
      const packCards = [];

      // Get a rare or higher card for the last slot
      let rareCard = null;
      // Prioritize holofoil and higher rarities
      const rareOrHigher = ["rare holo", "rare ultra", "rare secret"];

      // First try to get a holofoil or higher rarity card
      let foundHigherRarity = false;

      // Try each high rarity type in order of preference
      for (const rarityType of rareOrHigher) {
        if (cardsByRarity[rarityType] && cardsByRarity[rarityType].length > 0) {
          rareCard =
            cardsByRarity[rarityType][
              Math.floor(Math.random() * cardsByRarity[rarityType].length)
            ];
          foundHigherRarity = true;
          break;
        }
      }

      // If no holofoil or higher rarity card was found, fall back to regular rare
      if (
        !foundHigherRarity &&
        cardsByRarity["rare"] &&
        cardsByRarity["rare"].length > 0
      ) {
        rareCard =
          cardsByRarity["rare"][
            Math.floor(Math.random() * cardsByRarity["rare"].length)
          ];
      }

      // Get an energy card for the second-to-last slot
      let energyCard = null;
      if (energyCards.length > 0) {
        energyCard =
          energyCards[Math.floor(Math.random() * energyCards.length)];
      } else {
        // If no energy cards are available, use a common card as fallback
        if (cardsByRarity["common"] && cardsByRarity["common"].length > 0) {
          energyCard =
            cardsByRarity["common"][
              Math.floor(Math.random() * cardsByRarity["common"].length)
            ];
        } else {
          // Last resort: use any card
          energyCard =
            cardsFromSet[Math.floor(Math.random() * cardsFromSet.length)];
        }
      }

      // Add uncommons (usually 3)
      const uncommonCount = 3;
      if (cardsByRarity["uncommon"] && cardsByRarity["uncommon"].length > 0) {
        for (let i = 0; i < uncommonCount; i++) {
          const randomUncommon =
            cardsByRarity["uncommon"][
              Math.floor(Math.random() * cardsByRarity["uncommon"].length)
            ];
          packCards.push(randomUncommon);
        }
      }

      // Fill the rest with commons (up to CARDS_PER_PACK - 2 to leave space for energy and rare)
      const commonCount = CARDS_PER_PACK - 2 - packCards.length;
      if (cardsByRarity["common"] && cardsByRarity["common"].length > 0) {
        for (let i = 0; i < commonCount; i++) {
          const randomCommon =
            cardsByRarity["common"][
              Math.floor(Math.random() * cardsByRarity["common"].length)
            ];
          packCards.push(randomCommon);
        }
      }

      // If we don't have enough cards, fill with random cards from the set
      // (but still leave space for energy and rare)
      while (packCards.length < CARDS_PER_PACK - 2) {
        const randomCard =
          cardsFromSet[Math.floor(Math.random() * cardsFromSet.length)];
        packCards.push(randomCard);
      }

      // Add energy card in second-to-last position
      packCards.push(energyCard);

      // Add rare card in last position
      if (rareCard) {
        packCards.push(rareCard);
      } else {
        // Fallback if no rare card was found
        const randomCard =
          cardsFromSet[Math.floor(Math.random() * cardsFromSet.length)];
        packCards.push(randomCard);
      }

      // Shuffle all cards except the last two (energy and rare)
      const cardsToShuffle = packCards.slice(0, packCards.length - 2);
      const shuffledCards = cardsToShuffle.sort(() => Math.random() - 0.5);

      // Combine shuffled cards with energy and rare at the end
      const finalPack = [
        ...shuffledCards,
        packCards[packCards.length - 2], // Energy
        packCards[packCards.length - 1], // Rare
      ];

      // Simulate pack opening animation
      setTimeout(() => {
        setCards(finalPack);

        // Reveal cards one by one
        finalPack.forEach((_, index) => {
          setTimeout(() => {
            setRevealedCards((prev) => [...prev, index]);

            // Play a subtle card flip sound for each card reveal
            if (isEnabled) {
              playOverlap(0.3).catch((err) =>
                console.warn("Card flip sound failed:", err)
              );
            }
          }, 300 * (index + 1));
        });

        setPackOpening(false);
      }, 1500);
    } catch (error) {
      console.error("Error opening pack:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to open pack. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPackOpening(false);
    }
  };

  // View card details
  const viewCardDetails = (card) => {
    setSelectedCard(card);
    onOpen();
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    if (!rarity) return "gray.400";

    const rarityLower = rarity.toLowerCase();
    if (rarityLower.includes("common")) return "gray.400";
    if (rarityLower.includes("uncommon")) return "green.400";
    if (rarityLower.includes("rare") && rarityLower.includes("holo"))
      return "blue.400";
    if (rarityLower.includes("rare") && rarityLower.includes("ultra"))
      return "purple.400";
    if (rarityLower.includes("rare") && rarityLower.includes("secret"))
      return "yellow.400";
    if (rarityLower.includes("rare")) return "teal.400";

    return "gray.400";
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Pokémon TCG Pack Simulator
          </Heading>
          <Text fontSize="lg" color="gray.300" maxW="800px" mx="auto">
            Experience the thrill of opening Pokémon card packs! Select a set
            and open virtual packs with realistic odds.
          </Text>
        </Box>

        <Box bg="background.secondary" p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={6}>
            <HStack width="100%" spacing={4} wrap="wrap" justify="center">
              <Box flex="1" minW="200px">
                <Text mb={2} fontWeight="bold">
                  Select Card Set:
                </Text>
                <Select
                  value={selectedSet}
                  onChange={handleSetChange}
                  isDisabled={loading || packOpening}
                  bg="background.tertiary"
                >
                  {sets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.name} ({set.releaseDate})
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold">
                  Pack Preview:
                </Text>
                <Center
                  h="100px"
                  w="150px"
                  bg="background.tertiary"
                  borderRadius="md"
                  overflow="hidden"
                >
                  {packImage ? (
                    <Image
                      src={packImage}
                      alt="Pack artwork"
                      maxH="90px"
                      objectFit="contain"
                    />
                  ) : (
                    <Text>No pack image</Text>
                  )}
                </Center>
              </Box>
            </HStack>

            <Flex width="100%" justify="center" align="center" gap={4}>
              <Button
                colorScheme="brand"
                size="lg"
                leftIcon={<FaRandom />}
                onClick={openPack}
                isLoading={loading || packOpening}
                loadingText="Opening..."
                w={{ base: "full", md: "auto" }}
              >
                Open Pack
              </Button>

              <IconButton
                icon={isEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                onClick={toggle}
                variant="ghost"
                colorScheme={isEnabled ? "green" : "gray"}
                aria-label={isEnabled ? "Disable sound" : "Enable sound"}
                title={isEnabled ? "Disable sound" : "Enable sound"}
              />
            </Flex>
          </VStack>
        </Box>

        <Box position="relative" minH="500px">
          {/* Pack opening animation */}
          {packOpening && (
            <Center
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              zIndex="10"
            >
              <motion.div
                variants={packVariants}
                initial="initial"
                animate="opening"
              >
                <Image
                  src={packImage}
                  alt="Pack opening"
                  maxH="200px"
                  objectFit="contain"
                />
              </motion.div>
            </Center>
          )}

          {/* Cards display */}
          {cards.length > 0 && (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mt={6}>
              {cards.map((card, index) => {
                // Determine if this is a special position card
                const isEnergyPosition = index === cards.length - 2;
                const isRarePosition = index === cards.length - 1;
                const specialLabel = isEnergyPosition
                  ? "Energy"
                  : isRarePosition
                  ? "Rare"
                  : null;

                return (
                  <motion.div
                    key={`${card.id}-${index}`}
                    variants={cardVariants}
                    initial="initial"
                    animate={
                      revealedCards.includes(index)
                        ? ["flipped", "revealed"]
                        : "initial"
                    }
                    whileHover="hover"
                    style={{ perspective: "1000px" }}
                    onClick={() =>
                      revealedCards.includes(index) && viewCardDetails(card)
                    }
                  >
                    <Box
                      cursor={
                        revealedCards.includes(index) ? "pointer" : "default"
                      }
                      borderRadius="lg"
                      overflow="hidden"
                      position="relative"
                      h="300px"
                      bg="background.tertiary"
                      boxShadow={
                        isRarePosition
                          ? "0 0 15px 2px gold"
                          : isEnergyPosition
                          ? "0 0 15px 2px lightblue"
                          : "lg"
                      }
                    >
                      {revealedCards.includes(index) ? (
                        <>
                          <Image
                            src={card.images.small}
                            alt={card.name}
                            w="100%"
                            h="100%"
                            objectFit="contain"
                          />
                          <Badge
                            position="absolute"
                            top="2"
                            right="2"
                            colorScheme={getRarityColor(card.rarity)}
                            bg={getRarityColor(card.rarity)}
                          >
                            {card.rarity || "Common"}
                          </Badge>

                          {specialLabel && (
                            <Badge
                              position="absolute"
                              bottom="2"
                              left="2"
                              colorScheme={isRarePosition ? "yellow" : "blue"}
                              fontSize="xs"
                            >
                              {specialLabel}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Center h="100%">
                          <Image
                            src="https://assets.pokemon.com/assets/cms2/img/cards/web/SV1/SV1_EN_199.png"
                            alt="Card back"
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            opacity="0.7"
                          />
                          {specialLabel && revealedCards.length > 0 && (
                            <Badge
                              position="absolute"
                              bottom="2"
                              left="2"
                              colorScheme={isRarePosition ? "yellow" : "blue"}
                              fontSize="xs"
                            >
                              {specialLabel}
                            </Badge>
                          )}
                        </Center>
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </VStack>

      {/* Card detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="background.secondary">
          <ModalHeader>{selectedCard?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedCard && (
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                <Box flex="1">
                  <Image
                    src={selectedCard.images.large}
                    alt={selectedCard.name}
                    borderRadius="lg"
                    boxShadow="dark-lg"
                    w="100%"
                  />
                </Box>
                <VStack align="start" flex="1" spacing={4}>
                  <Box>
                    <Heading size="md">Card Info</Heading>
                    <Divider my={2} />
                    <Text>
                      <strong>Set:</strong> {selectedCard.set.name}
                    </Text>
                    <Text>
                      <strong>Number:</strong> {selectedCard.number}/
                      {selectedCard.set.printedTotal}
                    </Text>
                    <Text>
                      <strong>Rarity:</strong> {selectedCard.rarity || "Common"}
                    </Text>
                    {selectedCard.tcgplayer?.prices && (
                      <Text>
                        <strong>Market Price:</strong> $
                        {selectedCard.tcgplayer.prices.holofoil?.market ||
                          selectedCard.tcgplayer.prices.normal?.market ||
                          "N/A"}
                      </Text>
                    )}
                  </Box>

                  {selectedCard.types && (
                    <Box>
                      <Heading size="md">Types</Heading>
                      <Divider my={2} />
                      <HStack>
                        {selectedCard.types.map((type) => (
                          <Badge
                            key={type}
                            colorScheme={
                              type.toLowerCase() === "fire"
                                ? "red"
                                : type.toLowerCase() === "water"
                                ? "blue"
                                : type.toLowerCase() === "grass"
                                ? "green"
                                : type.toLowerCase() === "electric"
                                ? "yellow"
                                : type.toLowerCase() === "psychic"
                                ? "purple"
                                : "gray"
                            }
                          >
                            {type}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {selectedCard.attacks && (
                    <Box>
                      <Heading size="md">Attacks</Heading>
                      <Divider my={2} />
                      {selectedCard.attacks.map((attack, index) => (
                        <Box key={index} mb={2}>
                          <Text fontWeight="bold">
                            {attack.name}{" "}
                            {attack.damage && `- ${attack.damage}`}
                          </Text>
                          <Text fontSize="sm">{attack.text}</Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </VStack>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Rarity distribution info */}
      <Box mt={12} p={6} bg="background.secondary" borderRadius="lg">
        <Flex align="center" mb={4}>
          <Heading size="md">Pack Odds</Heading>
          <Tooltip label="Based on real Pokémon TCG pack distributions">
            <Box ml={2} color="gray.400">
              <FaInfoCircle />
            </Box>
          </Tooltip>
        </Flex>

        <Text mb={4}>
          Each pack contains 10 cards with authentic distribution. The rare card
          is always in the last position, and an energy card is in the
          second-to-last position, just like in real Pokémon TCG packs. For a
          more exciting experience, holofoil and higher rarity cards are
          prioritized for the rare slot!
        </Text>

        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="gray.400">
              Common
            </Text>
            <Text>70%</Text>
          </Box>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="green.400">
              Uncommon
            </Text>
            <Text>20%</Text>
          </Box>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="teal.400">
              Rare
            </Text>
            <Text>7.5%</Text>
          </Box>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="blue.400">
              Rare Holo
            </Text>
            <Text>2%</Text>
          </Box>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="purple.400">
              Ultra Rare
            </Text>
            <Text>0.4%</Text>
          </Box>
          <Box p={3} bg="background.tertiary" borderRadius="md">
            <Text fontWeight="bold" color="yellow.400">
              Secret Rare
            </Text>
            <Text>0.1%</Text>
          </Box>
        </SimpleGrid>

        <Flex mt={6} gap={4} flexWrap="wrap">
          <Box
            p={3}
            bg="background.tertiary"
            borderRadius="md"
            flex="1"
            minW="200px"
          >
            <Flex align="center">
              <Box
                w="16px"
                h="16px"
                borderRadius="full"
                bg="lightblue"
                mr={2}
              ></Box>
              <Text fontWeight="bold">Energy Card Position</Text>
            </Flex>
            <Text fontSize="sm" mt={1}>
              The second-to-last card is always an energy card, highlighted with
              a blue glow.
            </Text>
          </Box>

          <Box
            p={3}
            bg="background.tertiary"
            borderRadius="md"
            flex="1"
            minW="200px"
          >
            <Flex align="center">
              <Box w="16px" h="16px" borderRadius="full" bg="gold" mr={2}></Box>
              <Text fontWeight="bold">Rare Card Position</Text>
            </Flex>
            <Text fontSize="sm" mt={1}>
              The last card is always a rare or higher rarity card, highlighted
              with a gold glow. Holofoil, Ultra Rare, and Secret Rare cards are
              prioritized for this slot to make pack openings more exciting!
            </Text>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
};

export default PackOpeningPage;
