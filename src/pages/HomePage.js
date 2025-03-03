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
  Image,
  Stack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaLayerGroup,
  FaChartLine,
  FaDatabase,
} from "react-icons/fa";
import { getSets } from "../services/api";
// Replace local image import with a URL
const heroImageUrl = "https://images.pokemontcg.io/base1/1_hires.png";

const Feature = ({ title, text, icon }) => {
  // Use dark theme colors
  const textColor = "gray.300";
  const IconComponent = icon;

  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="brand.500"
        mb={4}
      >
        <IconComponent size={32} />
      </Flex>
      <Heading as="h3" size="md" mb={2} color="white">
        {title}
      </Heading>
      <Text color={textColor}>{text}</Text>
    </Stack>
  );
};

const HomePage = () => {
  // Use dark theme colors
  const bgColor = "background.primary";
  const cardBg = "background.secondary";
  const [recentSets, setRecentSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSets = async () => {
      try {
        setLoading(true);
        const response = await getSets();
        // Sort sets by release date (newest first) and take the first 8
        const sortedSets = response.data
          .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
          .slice(0, 8);
        setRecentSets(sortedSets);
      } catch (error) {
        console.error("Error fetching sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSets();
  }, []);

  return (
    <Box bg={bgColor}>
      {/* Hero Section */}
      <Box
        position="relative"
        height={{ base: "350px", md: "450px" }}
        overflow="hidden"
        mt={{ base: 0, md: 0 }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${heroImageUrl})`}
          bgSize="cover"
          bgPosition="center"
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "rgba(0, 0, 0, 0.7)",
          }}
        />

        <Container
          maxW="container.xl"
          position="relative"
          height="100%"
          zIndex={1}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="100%"
            textAlign="center"
            px={{ base: 4, md: 8 }}
          >
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl" }}
              mb={4}
              color="white"
            >
              Collect, Track, and Showcase Your Pokémon Cards
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              mb={8}
              color="gray.300"
              maxW="800px"
            >
              Build your digital collection, track card values, and organize
              your Pokémon TCG cards all in one place.
            </Text>
            <Flex gap={4} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/search"
                size="lg"
                colorScheme="brand"
                leftIcon={<FaSearch />}
                _hover={{ textDecoration: "none" }}
                style={{ textDecoration: "none" }}
              >
                Search Cards
              </Button>
              <Button
                as={RouterLink}
                to="/collections"
                size="lg"
                variant="outline"
                colorScheme="brand"
                leftIcon={<FaLayerGroup />}
                _hover={{ textDecoration: "none" }}
                style={{ textDecoration: "none" }}
              >
                View Collections
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={16} bg="background.primary">
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={12} textAlign="center" color="white">
            Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={FaSearch}
              title="Advanced Search"
              text="Search for cards by name, set, type, rarity, and more to find exactly what you're looking for."
            />
            <Feature
              icon={FaLayerGroup}
              title="Collection Management"
              text="Organize your cards into collections, track quantities, and manage your entire Pokémon card inventory."
            />
            <Feature
              icon={FaChartLine}
              title="Price Tracking"
              text="Monitor the market value of your cards over time and make informed decisions about buying and selling."
            />
            <Feature
              icon={FaDatabase}
              title="Comprehensive Database"
              text="Access information on thousands of Pokémon cards from every set, powered by the Pokémon TCG API."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Getting Started Section */}
      <Box py={16} bg="background.secondary">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            <Box>
              <Heading as="h2" size="xl" mb={6} color="white">
                Getting Started
              </Heading>
              <Text fontSize="lg" mb={6} color="gray.300">
                Begin your Pokémon TCG collection journey in just a few simple
                steps:
              </Text>
              <Stack spacing={4}>
                <Flex align="center">
                  <Box
                    as="span"
                    fontWeight="bold"
                    fontSize="lg"
                    color="brand.300"
                    mr={2}
                  >
                    1.
                  </Box>
                  <Text color="gray.100">
                    Search for cards you own or want to track
                  </Text>
                </Flex>
                <Flex align="center">
                  <Box
                    as="span"
                    fontWeight="bold"
                    fontSize="lg"
                    color="brand.300"
                    mr={2}
                  >
                    2.
                  </Box>
                  <Text color="gray.100">
                    Create collections to organize your cards
                  </Text>
                </Flex>
                <Flex align="center">
                  <Box
                    as="span"
                    fontWeight="bold"
                    fontSize="lg"
                    color="brand.300"
                    mr={2}
                  >
                    3.
                  </Box>
                  <Text color="gray.100">
                    Add cards to your collections with quantity and condition
                  </Text>
                </Flex>
                <Flex align="center">
                  <Box
                    as="span"
                    fontWeight="bold"
                    fontSize="lg"
                    color="brand.300"
                    mr={2}
                  >
                    4.
                  </Box>
                  <Text color="gray.100">
                    Monitor the value of your collection over time
                  </Text>
                </Flex>
              </Stack>
              <Button
                as={RouterLink}
                to="/search"
                size="lg"
                colorScheme="brand"
                mt={8}
                _hover={{ textDecoration: "none" }}
                style={{ textDecoration: "none" }}
              >
                Start Now
              </Button>
            </Box>
            <Flex justify="center" align="center">
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="dark-lg"
                maxW="400px"
                width="100%"
                borderWidth="1px"
                borderColor="gray.700"
              >
                <Heading
                  as="h3"
                  size="md"
                  mb={4}
                  textAlign="center"
                  color="white"
                >
                  Collection Summary
                </Heading>
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  mb={4}
                  bg="background.tertiary"
                  borderColor="gray.700"
                >
                  <Flex justify="space-between" mb={2}>
                    <Text color="gray.300">Total Collections:</Text>
                    <Text fontWeight="bold" color="white">
                      3
                    </Text>
                  </Flex>
                  <Flex justify="space-between" mb={2}>
                    <Text color="gray.300">Total Cards:</Text>
                    <Text fontWeight="bold" color="white">
                      127
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.300">Estimated Value:</Text>
                    <Text fontWeight="bold" color="brand.300">
                      $1,250.75
                    </Text>
                  </Flex>
                </Box>
                <Button
                  as={RouterLink}
                  to="/collections"
                  colorScheme="brand"
                  size="md"
                  width="100%"
                  _hover={{ textDecoration: "none" }}
                  style={{ textDecoration: "none" }}
                >
                  View Collections
                </Button>
              </Box>
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Recent Sets Section */}
      <Box py={16} bg="background.primary">
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={12} textAlign="center" color="white">
            Recent Pokémon TCG Sets
          </Heading>

          {loading ? (
            <Center py={10}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
              {recentSets.map((set) => (
                <Box
                  key={set.id}
                  bg={cardBg}
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  transition="transform 0.3s"
                  _hover={{ transform: "translateY(-5px)" }}
                  borderWidth="1px"
                  borderColor="gray.700"
                  as={RouterLink}
                  to={`/search?set=${set.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box height="200px" position="relative" overflow="hidden">
                    <Image
                      src={set.images.logo}
                      alt={set.name}
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      p={4}
                    />
                  </Box>
                  <Box p={4}>
                    <Heading as="h3" size="md" mb={2} color="white">
                      {set.name}
                    </Heading>
                    <Text color="gray.300" mb={4}>
                      Released: {new Date(set.releaseDate).getFullYear()}
                    </Text>
                    <Button
                      colorScheme="brand"
                      size="sm"
                      width="100%"
                      _hover={{ textDecoration: "none" }}
                    >
                      Browse Cards
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
