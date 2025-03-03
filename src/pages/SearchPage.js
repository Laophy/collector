import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Flex,
  Text,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import CardDetail from "../components/CardDetail";
import { useCollections } from "../contexts/CollectionContext";
import { searchCards } from "../services/api";

const SearchPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { collections, addCardToCollection, updateCardInCollection } =
    useCollections();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [lastSearchParams, setLastSearchParams] = useState(null);
  const [initialSetId, setInitialSetId] = useState(null);
  const pageSize = 20;
  const toast = useToast();

  // Use dark theme colors
  const bgColor = "background.primary";

  // Parse URL parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const setId = queryParams.get("set");

    if (setId) {
      setInitialSetId(setId);
      handleSearch({ set: setId });
    }
  }, [location.search]);

  // Scroll to top when search results change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchResults]);

  const handleSearchResults = (results) => {
    // The API returns data in a 'data' property
    if (results && results.data) {
      setSearchResults(results.data);
      setTotalCards(results.totalCount || 0);
      setTotalPages(Math.ceil((results.totalCount || 0) / pageSize));
    } else {
      setSearchResults([]);
      setTotalCards(0);
      setTotalPages(0);
    }
  };

  const handleSearch = async (params) => {
    setLoading(true);
    setLastSearchParams(params);
    setCurrentPage(1);

    try {
      const results = await searchCards({
        ...params,
        page: 1,
        pageSize: pageSize,
      });
      handleSearchResults(results);
    } catch (error) {
      console.error("Error searching cards:", error);
      setSearchResults([]);
      setTotalCards(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages || !lastSearchParams) return;

    setLoading(true);
    setCurrentPage(newPage);

    try {
      const results = await searchCards({
        ...lastSearchParams,
        page: newPage,
        pageSize: pageSize,
      });
      handleSearchResults(results);
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCollection = (collectionId, card, quantity = 1) => {
    if (collectionId && card) {
      addCardToCollection(collectionId, card, quantity);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with current page in the middle
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.unshift("...");
        pages.unshift(1);
      }

      // Add last page and ellipsis if needed
      if (endPage < totalPages) {
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Heading as="h1" size="xl" mb={8} color="white">
          Search Pokémon Cards
        </Heading>

        <SearchBar
          onSearchResults={handleSearch}
          onLoading={setLoading}
          initialSetId={initialSetId}
        />

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : searchResults.length > 0 ? (
          <>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color="gray.300">
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalCards)} of {totalCards}{" "}
                results
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {searchResults.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onViewDetails={() => handleViewDetails(card)}
                  collections={collections}
                  onAddToCollection={handleAddToCollection}
                />
              ))}
            </SimpleGrid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="center" mt={8}>
                <HStack spacing={2}>
                  <IconButton
                    icon={<FaChevronLeft />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    aria-label="Previous page"
                    colorScheme="brand"
                    variant="outline"
                  />

                  {getPageNumbers().map((page, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                      isDisabled={typeof page !== "number"}
                      colorScheme="brand"
                      variant={currentPage === page ? "solid" : "outline"}
                    >
                      {page}
                    </Button>
                  ))}

                  <IconButton
                    icon={<FaChevronRight />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    aria-label="Next page"
                    colorScheme="brand"
                    variant="outline"
                  />
                </HStack>
              </Flex>
            )}
          </>
        ) : (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            bg="background.secondary"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <AlertIcon boxSize="40px" mr={0} color="brand.500" />
            <AlertTitle mt={4} mb={1} fontSize="lg" color="white">
              No Results Found
            </AlertTitle>
            <AlertDescription maxWidth="sm" color="gray.300">
              Try adjusting your search criteria or browse all cards.
            </AlertDescription>
          </Alert>
        )}

        {/* Card Detail Modal */}
        {selectedCard && (
          <CardDetail
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            card={selectedCard}
            collections={collections}
            onAddToCollection={handleAddToCollection}
            onUpdateQuantity={updateCardInCollection}
          />
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;
