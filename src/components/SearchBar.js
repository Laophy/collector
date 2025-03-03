import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Select,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Heading,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { getSets } from "../services/api";

const SearchBar = ({ onSearchResults, onLoading, initialSetId }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [rarity, setRarity] = useState("");
  const [set, setSet] = useState("");
  const [sets, setSets] = useState([]);
  const [loadingSets, setLoadingSets] = useState(false);

  // Use dark theme colors
  const bgColor = "background.secondary";
  const borderColor = "gray.700";

  // Fetch all sets for the dropdown
  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoadingSets(true);
        const response = await getSets();
        // Sort sets by release date (newest first)
        const sortedSets = response.data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setSets(sortedSets);
      } catch (error) {
        console.error("Error fetching sets:", error);
      } finally {
        setLoadingSets(false);
      }
    };

    fetchSets();
  }, []);

  // Set the initial set value if provided
  useEffect(() => {
    if (initialSetId) {
      setSet(initialSetId);
    }
  }, [initialSetId]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Create search parameters object
    const params = {
      q: query,
    };

    if (type) params.types = type;
    if (rarity) params.rarity = rarity;
    if (set) params.set = set;

    // Pass the parameters to the parent component
    onSearchResults(params);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSearch}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={5}
      mb={6}
      boxShadow="dark-lg"
    >
      <Heading size="md" mb={4} color="white">
        Search Pokémon Cards
      </Heading>

      <Stack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="query" color="gray.300">
            Card Name
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.500" />}
            />
            <Input
              id="query"
              placeholder="Search by card name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              borderRadius="md"
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                color: "white",
              }}
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </FormControl>

        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <FormControl>
            <FormLabel htmlFor="type" color="gray.300">
              Type
            </FormLabel>
            <Select
              id="type"
              placeholder="Select type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                color: "white",
              }}
              sx={{
                option: {
                  bg: "background.tertiary",
                  color: "white",
                },
              }}
            >
              <option value="Colorless">Colorless</option>
              <option value="Darkness">Darkness</option>
              <option value="Dragon">Dragon</option>
              <option value="Fairy">Fairy</option>
              <option value="Fighting">Fighting</option>
              <option value="Fire">Fire</option>
              <option value="Grass">Grass</option>
              <option value="Lightning">Lightning</option>
              <option value="Metal">Metal</option>
              <option value="Psychic">Psychic</option>
              <option value="Water">Water</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="rarity" color="gray.300">
              Rarity
            </FormLabel>
            <Select
              id="rarity"
              placeholder="Select rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                color: "white",
              }}
              sx={{
                option: {
                  bg: "background.tertiary",
                  color: "white",
                },
              }}
            >
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Rare Holo">Rare Holo</option>
              <option value="Rare Ultra">Rare Ultra</option>
              <option value="Rare Secret">Rare Secret</option>
              <option value="Rare Rainbow">Rare Rainbow</option>
              <option value="Promo">Promo</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="set" color="gray.300">
              Set
            </FormLabel>
            <Select
              id="set"
              placeholder="Select set"
              value={set}
              onChange={(e) => setSet(e.target.value)}
              bg="background.tertiary"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                color: "white",
              }}
              sx={{
                option: {
                  bg: "background.tertiary",
                  color: "white",
                },
              }}
            >
              {loadingSets ? (
                <option value="" disabled>
                  Loading sets...
                </option>
              ) : (
                sets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))
              )}
            </Select>
          </FormControl>
        </Flex>

        <Button
          type="submit"
          colorScheme="brand"
          size="md"
          width={{ base: "100%", md: "auto" }}
          alignSelf={{ base: "stretch", md: "flex-end" }}
          mt={2}
        >
          Search
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchBar;
