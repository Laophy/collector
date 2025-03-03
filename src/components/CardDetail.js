import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Image,
  Heading,
  Text,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  VStack,
  HStack,
  useToast,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CardDetail = ({
  isOpen,
  card,
  onClose,
  collections = [],
  onAddToCollection,
  onUpdateQuantity,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const [priceData, setPriceData] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1y");

  // For the alert dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [collectionToRemove, setCollectionToRemove] = useState(null);
  const cancelRef = useRef();

  // Use dark theme colors
  const bgColor = "background.secondary";
  const borderColor = "gray.700";
  const statBgColor = "background.tertiary";
  const priceColor = "brand.300";
  const textColor = "white";
  const subTextColor = "gray.300";

  // Set first collection as default if available
  useEffect(() => {
    if (collections.length > 0 && !selectedCollection) {
      setSelectedCollection(collections[0].id);
    }
  }, [collections, selectedCollection]);

  // Prepare price data for chart when card changes
  useEffect(() => {
    if (card && card.tcgplayer && card.tcgplayer.prices) {
      const prices = card.tcgplayer.prices;

      // Get the most relevant price type for this card
      const priceType = prices.holofoil
        ? "holofoil"
        : prices.normal
        ? "normal"
        : prices.reverseHolofoil
        ? "reverseHolofoil"
        : prices.firstEdition
        ? "firstEdition"
        : prices.unlimited
        ? "unlimited"
        : null;

      if (priceType) {
        // Create mock dates for the last 12 months (since the API doesn't provide historical data)
        // In a real app, you would use actual historical data from an API
        const today = new Date();
        const mockData = {
          labels: [],
          values: [],
          highValues: [],
          lowValues: [],
        };

        // Use low, mid, and market prices to create a more detailed trend
        const lowPrice = prices[priceType].low || 0;
        const marketPrice = prices[priceType].market || 0;
        const highPrice = prices[priceType].high || 0;

        // Create a more realistic price history with 12 data points (one year)
        // This is mock data - in a real app, you would fetch actual historical data
        const basePrice = marketPrice;
        const volatility = (highPrice - lowPrice) / 4; // Reduced volatility for more realistic trend

        for (let i = 11; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          mockData.labels.push(
            date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          );

          // Create a somewhat realistic price trend with some randomness
          // Prices tend to increase over time with some fluctuations
          const randomFactor = Math.random() * volatility - volatility / 2;
          const trendFactor = (11 - i) * (volatility / 20); // Slight upward trend
          const monthPrice = Math.max(
            basePrice - trendFactor + randomFactor,
            0.01
          );
          mockData.values.push(parseFloat(monthPrice.toFixed(2)));

          // Generate high and low values for each month
          const monthHigh = parseFloat(
            (monthPrice * (1 + Math.random() * 0.15)).toFixed(2)
          );
          const monthLow = parseFloat(
            (monthPrice * (1 - Math.random() * 0.15)).toFixed(2)
          );
          mockData.highValues.push(monthHigh);
          mockData.lowValues.push(monthLow);
        }

        // Make sure the last value is the current market price
        mockData.values[11] = marketPrice;
        mockData.highValues[11] = highPrice;
        mockData.lowValues[11] = lowPrice;

        setPriceData({
          type: priceType,
          data: mockData,
        });
      }
    }
  }, [card]);

  // Handle quantity change
  const handleQuantityChange = (value) => {
    setQuantity(parseInt(value));
  };

  // Handle collection selection change
  const handleCollectionChange = (e) => {
    setSelectedCollection(e.target.value);
  };

  // Check if card exists in any collections
  const getCollectionsWithCard = () => {
    return collections.filter((collection) =>
      collection.cards.some((c) => c.id === card.id)
    );
  };

  // Get card quantity in a specific collection
  const getCardQuantityInCollection = (collectionId) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return 0;

    const cardInCollection = collection.cards.find((c) => c.id === card.id);
    return cardInCollection ? cardInCollection.quantity : 0;
  };

  // Default implementation for onUpdateQuantity if not provided
  const handleUpdateQuantity = (collectionId, cardId, newQuantity) => {
    if (typeof onUpdateQuantity === "function") {
      return onUpdateQuantity(collectionId, cardId, newQuantity);
    } else {
      console.warn(
        "onUpdateQuantity prop not provided to CardDetail component"
      );
      // Return a rejected promise to simulate an error
      return Promise.reject(
        new Error(
          "Update function not available. This feature requires the onUpdateQuantity prop."
        )
      );
    }
  };

  // Handle quantity update in existing collection
  const updateCardQuantity = (collectionId, newQuantity) => {
    if (newQuantity <= 0) {
      // Show confirmation toast for removing card
      toast({
        title: "Remove card?",
        description:
          "Setting quantity to 0 will remove this card from the collection.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsUpdating(true);
    try {
      handleUpdateQuantity(collectionId, card.id, newQuantity);
      toast({
        title: "Quantity updated",
        description: `${card.name} quantity has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update card quantity.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle removing card from collection
  const handleRemoveFromCollection = (collectionId) => {
    setCollectionToRemove(collectionId);
    setIsAlertOpen(true);
  };

  // Actually perform the removal after confirmation
  const performRemove = async () => {
    if (!collectionToRemove) return;

    setIsAlertOpen(false);
    setIsUpdating(true);

    try {
      // Use our handleUpdateQuantity function which has a fallback
      await handleUpdateQuantity(collectionToRemove, card.id, 0);

      // Show success toast
      toast({
        title: "Card removed",
        description: `${card.name} has been removed from the collection.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset state after a short delay to allow UI to update
      setTimeout(() => {
        setIsUpdating(false);
        setCollectionToRemove(null);
      }, 500);
    } catch (error) {
      console.error("Error removing card:", error);

      // Show error toast with more helpful message
      toast({
        title: "Error removing card",
        description:
          error.message ||
          "Failed to remove card from collection. Please try again or refresh the page.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // Reset state
      setIsUpdating(false);
      setCollectionToRemove(null);
    }
  };

  // Add card to selected collection
  const handleAddToCollection = () => {
    if (selectedCollection && quantity > 0) {
      setIsAdding(true);
      try {
        onAddToCollection(selectedCollection, card, quantity);
        toast({
          title: "Card added",
          description: `${card.name} has been added to your collection.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
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
    }
  };

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : "N/A";
  };

  // Get market price from tcgplayer data
  const getMarketPrice = () => {
    if (!card.tcgplayer || !card.tcgplayer.prices) return "N/A";

    const prices = card.tcgplayer.prices;
    const price =
      prices.holofoil?.market ||
      prices.normal?.market ||
      prices.reverseHolofoil?.market ||
      prices.firstEdition?.market ||
      prices.unlimited?.market;

    return formatPrice(price);
  };

  // Get price statistics based on selected time period
  const getPriceStats = () => {
    if (!priceData) return { market: "N/A", high: "N/A", low: "N/A" };

    const { values, highValues, lowValues } = priceData.data;
    let filteredValues = [...values];
    let filteredHighValues = [...highValues];
    let filteredLowValues = [...lowValues];

    // Filter based on time period
    if (timePeriod === "1m") {
      filteredValues = values.slice(-1);
      filteredHighValues = highValues.slice(-1);
      filteredLowValues = lowValues.slice(-1);
    } else if (timePeriod === "3m") {
      filteredValues = values.slice(-3);
      filteredHighValues = highValues.slice(-3);
      filteredLowValues = lowValues.slice(-3);
    } else if (timePeriod === "6m") {
      filteredValues = values.slice(-6);
      filteredHighValues = highValues.slice(-6);
      filteredLowValues = lowValues.slice(-6);
    }

    // Get the latest market price
    const market = filteredValues[filteredValues.length - 1];

    // Find the highest and lowest prices in the selected period
    const high = Math.max(...filteredHighValues);
    const low = Math.min(...filteredLowValues);

    return {
      market: formatPrice(market),
      high: formatPrice(high),
      low: formatPrice(low),
      period:
        timePeriod === "1m"
          ? "Last Month"
          : timePeriod === "3m"
          ? "Last 3 Months"
          : timePeriod === "6m"
          ? "Last 6 Months"
          : "Current",
    };
  };

  // Filter price data based on selected time period
  const getFilteredChartData = () => {
    if (!priceData) return { labels: [], datasets: [] };

    const { labels, values, highValues, lowValues } = priceData.data;
    let filteredLabels = [...labels];
    let filteredValues = [...values];
    let filteredHighValues = [...highValues];
    let filteredLowValues = [...lowValues];

    // Filter based on time period
    if (timePeriod === "1m") {
      filteredLabels = labels.slice(-1);
      filteredValues = values.slice(-1);
      filteredHighValues = highValues.slice(-1);
      filteredLowValues = lowValues.slice(-1);
    } else if (timePeriod === "3m") {
      filteredLabels = labels.slice(-3);
      filteredValues = values.slice(-3);
      filteredHighValues = highValues.slice(-3);
      filteredLowValues = lowValues.slice(-3);
    } else if (timePeriod === "6m") {
      filteredLabels = labels.slice(-6);
      filteredValues = values.slice(-6);
      filteredHighValues = highValues.slice(-6);
      filteredLowValues = lowValues.slice(-6);
    }
    // 1y is the default, no filtering needed

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: `Market Price`,
          data: filteredValues,
          borderColor: "#ff6868",
          backgroundColor: "rgba(255, 104, 104, 0.2)",
          tension: 0.3,
          pointBackgroundColor: "#ff3333",
          pointBorderColor: "#fff",
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          order: 1,
        },
        {
          label: `High Price`,
          data: filteredHighValues,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0)",
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          order: 2,
        },
        {
          label: `Low Price`,
          data: filteredLowValues,
          borderColor: "#FFC107",
          backgroundColor: "rgba(255, 193, 7, 0)",
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          order: 3,
        },
      ],
    };
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  // Prepare chart data
  const chartData = getFilteredChartData();

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: `Price History (${
          timePeriod === "1m"
            ? "Last Month"
            : timePeriod === "3m"
            ? "Last 3 Months"
            : timePeriod === "6m"
            ? "Last 6 Months"
            : "Last 12 Months"
        })`,
        color: "white",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(42, 42, 42, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#404040",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || "";
            const value = context.raw.toFixed(2);
            return `${datasetLabel}: $${value}`;
          },
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
        },
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          callback: (value) => `$${value}`,
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  if (!card) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          maxW="900px"
          minH={{ base: "auto", md: "750px" }}
          h={{ md: "750px" }}
          overflow="hidden"
          bg={bgColor}
          color={textColor}
          borderRadius="xl"
          boxShadow="0 0 20px rgba(0, 0, 0, 0.5)"
          p={0}
        >
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor} py={4}>
            <Flex justify="space-between" align="center">
              <Heading as="h2" size="lg" color={textColor}>
                {card.name}
              </Heading>
              <Badge
                colorScheme="brand"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                {card.rarity || "Common"}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody p={0} overflowY="hidden">
            <Flex
              direction={{ base: "column", md: "row" }}
              h="full"
              minH={{ md: "550px" }}
            >
              {/* Card Image Column */}
              <Box
                w={{ base: "full", md: "40%" }}
                bg="background.primary"
                p={6}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                position="relative"
                overflow="hidden"
                h={{ md: "full" }}
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  opacity="0.1"
                  bgImage={`url(${card.images.small})`}
                  bgPosition="center"
                  bgSize="cover"
                  bgRepeat="no-repeat"
                  filter="blur(20px)"
                />
                <Box
                  position="relative"
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={card.images.large}
                    alt={card.name}
                    maxH="500px"
                    objectFit="contain"
                    borderRadius="md"
                    boxShadow="dark-lg"
                    transform="rotate(3deg)"
                    transition="all 0.3s ease"
                    _hover={{ transform: "rotate(0deg) scale(1.05)" }}
                  />
                </Box>
              </Box>

              {/* Card Details Column */}
              <Box
                w={{ base: "full", md: "60%" }}
                p={6}
                display="flex"
                flexDirection="column"
              >
                <Tabs
                  colorScheme="brand"
                  variant="enclosed"
                  isLazy
                  h="full"
                  display="flex"
                  flexDirection="column"
                >
                  <TabList borderColor="gray.700" mb={4}>
                    <Tab
                      color={textColor}
                      _selected={{
                        color: "brand.300",
                        bg: "background.tertiary",
                        borderColor: "gray.700",
                      }}
                      _focus={{
                        boxShadow: "none",
                        outline: "none",
                      }}
                    >
                      Details
                    </Tab>
                    <Tab
                      color={textColor}
                      _selected={{
                        color: "brand.300",
                        bg: "background.tertiary",
                        borderColor: "gray.700",
                      }}
                      _focus={{
                        boxShadow: "none",
                        outline: "none",
                      }}
                    >
                      Pricing
                    </Tab>
                    <Tab
                      color={textColor}
                      _selected={{
                        color: "brand.300",
                        bg: "background.tertiary",
                        borderColor: "gray.700",
                      }}
                      _focus={{
                        boxShadow: "none",
                        outline: "none",
                      }}
                    >
                      Collection
                    </Tab>
                  </TabList>

                  <TabPanels flex="1" overflowY="auto">
                    {/* Details Tab */}
                    <TabPanel p={4} h="full">
                      <VStack align="stretch" spacing={5}>
                        <Box
                          p={4}
                          bg="background.tertiary"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Heading as="h3" size="sm" mb={3} color={textColor}>
                            Card Information
                          </Heading>
                          <SimpleGrid columns={2} spacing={3}>
                            <Text fontWeight="bold" color={textColor}>
                              Set:
                            </Text>
                            <Text color={subTextColor}>{card.set.name}</Text>

                            <Text fontWeight="bold" color={textColor}>
                              Number:
                            </Text>
                            <Text color={subTextColor}>
                              {card.number}/{card.set.printedTotal}
                            </Text>

                            <Text fontWeight="bold" color={textColor}>
                              Rarity:
                            </Text>
                            <Text color={subTextColor}>
                              {card.rarity || "N/A"}
                            </Text>

                            <Text fontWeight="bold" color={textColor}>
                              Artist:
                            </Text>
                            <Text color={subTextColor}>
                              {card.artist || "N/A"}
                            </Text>
                          </SimpleGrid>
                        </Box>

                        {card.types && (
                          <Box
                            p={4}
                            bg="background.tertiary"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <Heading as="h3" size="sm" mb={3} color={textColor}>
                              Types
                            </Heading>
                            <HStack spacing={2} wrap="wrap">
                              {card.types.map((type) => (
                                <Badge
                                  key={type}
                                  colorScheme={
                                    type === "Fire"
                                      ? "red"
                                      : type === "Water"
                                      ? "blue"
                                      : type === "Grass"
                                      ? "green"
                                      : type === "Lightning"
                                      ? "yellow"
                                      : type === "Psychic"
                                      ? "purple"
                                      : type === "Fighting"
                                      ? "orange"
                                      : type === "Darkness"
                                      ? "gray"
                                      : type === "Metal"
                                      ? "gray"
                                      : type === "Fairy"
                                      ? "pink"
                                      : type === "Dragon"
                                      ? "teal"
                                      : "gray"
                                  }
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  fontSize="sm"
                                >
                                  {type}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        {card.attacks && (
                          <Box
                            p={4}
                            bg="background.tertiary"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <Heading as="h3" size="sm" mb={3} color={textColor}>
                              Attacks
                            </Heading>
                            <VStack align="stretch" spacing={3}>
                              {card.attacks.map((attack, index) => (
                                <Box
                                  key={index}
                                  p={3}
                                  borderWidth="1px"
                                  borderRadius="md"
                                  borderColor="gray.700"
                                  bg="background.secondary"
                                >
                                  <Flex justify="space-between">
                                    <Heading
                                      as="h4"
                                      size="xs"
                                      color={textColor}
                                    >
                                      {attack.name}
                                    </Heading>
                                    <Text color="brand.300" fontWeight="bold">
                                      {attack.damage || ""}
                                    </Text>
                                  </Flex>
                                  <Text
                                    fontSize="sm"
                                    mt={2}
                                    color={subTextColor}
                                  >
                                    {attack.text}
                                  </Text>
                                </Box>
                              ))}
                            </VStack>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Pricing Tab */}
                    <TabPanel p={4} h="full">
                      <VStack align="stretch" spacing={5}>
                        <Box
                          p={4}
                          bg="background.tertiary"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Heading as="h3" size="sm" mb={4} color={textColor}>
                            TCGPlayer Prices{" "}
                            {timePeriod === "1y"
                              ? "(Current)"
                              : `(${getPriceStats().period})`}
                          </Heading>
                          <StatGroup>
                            <Stat>
                              <StatLabel color="gray.300">
                                Market Price
                              </StatLabel>
                              <StatNumber color={priceColor} fontSize="2xl">
                                {priceData
                                  ? getPriceStats().market
                                  : getMarketPrice()}
                              </StatNumber>
                              <StatHelpText color="gray.400">
                                {timePeriod === "1y"
                                  ? "Current value"
                                  : "Latest in period"}
                              </StatHelpText>
                            </Stat>

                            {priceData && (
                              <>
                                <Stat>
                                  <StatLabel color="gray.300">Low</StatLabel>
                                  <StatNumber color="white" fontSize="2xl">
                                    {getPriceStats().low}
                                  </StatNumber>
                                  <StatHelpText color="gray.400">
                                    Lowest in period
                                  </StatHelpText>
                                </Stat>

                                <Stat>
                                  <StatLabel color="gray.300">High</StatLabel>
                                  <StatNumber color="white" fontSize="2xl">
                                    {getPriceStats().high}
                                  </StatNumber>
                                  <StatHelpText color="gray.400">
                                    Highest in period
                                  </StatHelpText>
                                </Stat>
                              </>
                            )}
                          </StatGroup>
                        </Box>

                        {/* Price History Chart */}
                        <Box
                          p={4}
                          bg="background.tertiary"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <Flex justify="space-between" align="center" mb={4}>
                            <Heading as="h3" size="sm" color={textColor}>
                              Price History
                            </Heading>
                            <HStack spacing={2}>
                              <Button
                                size="xs"
                                colorScheme={
                                  timePeriod === "1m" ? "brand" : "gray"
                                }
                                variant={
                                  timePeriod === "1m" ? "solid" : "outline"
                                }
                                onClick={() => handleTimePeriodChange("1m")}
                                _focus={{ boxShadow: "none", outline: "none" }}
                              >
                                1M
                              </Button>
                              <Button
                                size="xs"
                                colorScheme={
                                  timePeriod === "3m" ? "brand" : "gray"
                                }
                                variant={
                                  timePeriod === "3m" ? "solid" : "outline"
                                }
                                onClick={() => handleTimePeriodChange("3m")}
                                _focus={{ boxShadow: "none", outline: "none" }}
                              >
                                3M
                              </Button>
                              <Button
                                size="xs"
                                colorScheme={
                                  timePeriod === "6m" ? "brand" : "gray"
                                }
                                variant={
                                  timePeriod === "6m" ? "solid" : "outline"
                                }
                                onClick={() => handleTimePeriodChange("6m")}
                                _focus={{ boxShadow: "none", outline: "none" }}
                              >
                                6M
                              </Button>
                              <Button
                                size="xs"
                                colorScheme={
                                  timePeriod === "1y" ? "brand" : "gray"
                                }
                                variant={
                                  timePeriod === "1y" ? "solid" : "outline"
                                }
                                onClick={() => handleTimePeriodChange("1y")}
                                _focus={{ boxShadow: "none", outline: "none" }}
                              >
                                1Y
                              </Button>
                            </HStack>
                          </Flex>
                          <Box height="220px" minH="220px">
                            {priceData ? (
                              <Line data={chartData} options={chartOptions} />
                            ) : (
                              <Flex
                                height="100%"
                                align="center"
                                justify="center"
                              >
                                <Text color={subTextColor}>
                                  No price history available
                                </Text>
                              </Flex>
                            )}
                          </Box>
                        </Box>

                        {card.tcgplayer?.url && (
                          <Button
                            as="a"
                            href={card.tcgplayer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="brand"
                            size="md"
                            width="full"
                          >
                            View on TCGPlayer
                          </Button>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Add to Collection Tab */}
                    <TabPanel
                      p={4}
                      h="full"
                      display="flex"
                      flexDirection="column"
                    >
                      <VStack align="stretch" spacing={5} h="full">
                        <Heading as="h3" size="md" color={textColor} mb={2}>
                          Manage Collections
                        </Heading>

                        {/* Collections that already have this card */}
                        {getCollectionsWithCard().length > 0 && (
                          <Box
                            p={4}
                            bg="background.tertiary"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <Heading as="h3" size="sm" mb={3} color={textColor}>
                              Current Collections
                            </Heading>
                            <VStack align="stretch" spacing={3}>
                              {getCollectionsWithCard().map((collection) => (
                                <Flex
                                  key={collection.id}
                                  p={3}
                                  bg="background.secondary"
                                  borderRadius="md"
                                  borderWidth="1px"
                                  borderColor="gray.700"
                                  justify="space-between"
                                  align="center"
                                  transition="all 0.2s"
                                  _hover={{
                                    borderColor: "brand.300",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                  }}
                                >
                                  <Box>
                                    <Text fontWeight="bold" color={textColor}>
                                      {collection.name}
                                    </Text>
                                    <Text fontSize="sm" color={subTextColor}>
                                      Current quantity:{" "}
                                      {getCardQuantityInCollection(
                                        collection.id
                                      )}
                                    </Text>
                                  </Box>
                                  <Flex align="center">
                                    <NumberInput
                                      min={1}
                                      max={99}
                                      value={getCardQuantityInCollection(
                                        collection.id
                                      )}
                                      onChange={(value) =>
                                        updateCardQuantity(
                                          collection.id,
                                          parseInt(value)
                                        )
                                      }
                                      size="sm"
                                      maxW="80px"
                                      mr={2}
                                    >
                                      <NumberInputField
                                        bg="background.primary"
                                        borderColor="gray.600"
                                        color={textColor}
                                      />
                                      <NumberInputStepper color={textColor}>
                                        <NumberIncrementStepper
                                          color={textColor}
                                        />
                                        <NumberDecrementStepper
                                          color={textColor}
                                        />
                                      </NumberInputStepper>
                                    </NumberInput>
                                    <Button
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() =>
                                        handleRemoveFromCollection(
                                          collection.id
                                        )
                                      }
                                      title="Remove from collection"
                                      _hover={{
                                        bg: "red.900",
                                      }}
                                      isDisabled={isUpdating}
                                    >
                                      <Box as="span" fontSize="lg">
                                        ×
                                      </Box>
                                    </Button>
                                  </Flex>
                                </Flex>
                              ))}
                            </VStack>
                          </Box>
                        )}

                        {/* Add to new collection section */}
                        {collections.length > 0 && (
                          <Box
                            p={4}
                            bg="background.tertiary"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            flex="1"
                          >
                            <Heading as="h3" size="sm" mb={3} color={textColor}>
                              Add to New Collection
                            </Heading>

                            {collections.filter(
                              (collection) =>
                                !collection.cards.some((c) => c.id === card.id)
                            ).length === 0 ? (
                              <Text fontSize="sm" color={subTextColor} mt={2}>
                                This card is already in all your collections.
                              </Text>
                            ) : (
                              <>
                                <SimpleGrid
                                  columns={{ base: 1, sm: 2 }}
                                  spacing={4}
                                  mb={4}
                                >
                                  {collections
                                    .filter(
                                      (collection) =>
                                        !collection.cards.some(
                                          (c) => c.id === card.id
                                        )
                                    )
                                    .map((collection) => (
                                      <Box
                                        key={collection.id}
                                        p={4}
                                        bg={
                                          selectedCollection === collection.id
                                            ? "brand.900"
                                            : "background.secondary"
                                        }
                                        borderRadius="md"
                                        borderWidth="1px"
                                        borderColor={
                                          selectedCollection === collection.id
                                            ? "brand.300"
                                            : "gray.700"
                                        }
                                        cursor="pointer"
                                        onClick={() =>
                                          setSelectedCollection(collection.id)
                                        }
                                        transition="all 0.2s"
                                        _hover={{
                                          borderColor: "brand.300",
                                          transform: "translateY(-2px)",
                                          boxShadow:
                                            "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                        position="relative"
                                        overflow="hidden"
                                      >
                                        {selectedCollection ===
                                          collection.id && (
                                          <Box
                                            position="absolute"
                                            top="0"
                                            right="0"
                                            bg="brand.300"
                                            p={1}
                                            borderBottomLeftRadius="md"
                                          >
                                            <FaPlus color="white" size="12px" />
                                          </Box>
                                        )}
                                        <Heading
                                          as="h4"
                                          size="xs"
                                          color={textColor}
                                          mb={1}
                                        >
                                          {collection.name}
                                        </Heading>
                                        <Text
                                          fontSize="xs"
                                          color={subTextColor}
                                        >
                                          {collection.cards.length} cards
                                        </Text>
                                      </Box>
                                    ))}
                                </SimpleGrid>

                                {selectedCollection && (
                                  <Box mt={4}>
                                    <Flex
                                      align="center"
                                      justify="space-between"
                                    >
                                      <Text fontWeight="bold" color={textColor}>
                                        Quantity:
                                      </Text>
                                      <NumberInput
                                        min={1}
                                        max={99}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        size="md"
                                        maxW="120px"
                                      >
                                        <NumberInputField
                                          bg="background.secondary"
                                          borderColor="gray.600"
                                          color={textColor}
                                          _hover={{ borderColor: "brand.400" }}
                                          _focus={{
                                            borderColor: "brand.300",
                                            boxShadow: "0 0 0 1px #ff6868",
                                          }}
                                        />
                                        <NumberInputStepper color={textColor}>
                                          <NumberIncrementStepper
                                            color={textColor}
                                          />
                                          <NumberDecrementStepper
                                            color={textColor}
                                          />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Flex>

                                    <Button
                                      colorScheme="brand"
                                      onClick={handleAddToCollection}
                                      isLoading={isAdding}
                                      size="md"
                                      width="full"
                                      mt={4}
                                    >
                                      <FaPlus style={{ marginRight: "8px" }} />
                                      Add to Collection
                                    </Button>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                        )}

                        {collections.length === 0 && (
                          <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            p={6}
                            bg="background.tertiary"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            flex="1"
                          >
                            <Text
                              color={subTextColor}
                              fontSize="lg"
                              textAlign="center"
                              mb={4}
                            >
                              You don't have any collections yet.
                            </Text>
                            <Button
                              as="a"
                              href="/collections/new"
                              colorScheme="brand"
                              size="lg"
                              width="full"
                              maxW="300px"
                            >
                              <FaPlus style={{ marginRight: "8px" }} />
                              Create Your First Collection
                            </Button>
                          </Flex>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor} py={3}>
            <Button
              variant="outline"
              colorScheme="brand"
              onClick={onClose}
              _hover={{ bg: "background.primary" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialog for removing card */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="background.secondary" color={textColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Card
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove {card?.name} from this collection?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={performRemove} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CardDetail;
