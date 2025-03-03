import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFoundPage = () => {
  // Use dark theme colors
  const bgColor = "background.primary";
  const textColor = "gray.300";

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.md" py={20}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
        >
          <Heading
            as="h1"
            size="4xl"
            fontWeight="bold"
            color="brand.500"
            mb={4}
          >
            404
          </Heading>

          <Heading as="h2" size="xl" mb={6} color="white">
            Page Not Found
          </Heading>

          <Text fontSize="lg" color={textColor} maxW="lg" mb={10}>
            The page you are looking for doesn't exist or has been moved. Please
            check the URL or navigate back to the homepage.
          </Text>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              colorScheme="brand"
              size="lg"
              _hover={{ textDecoration: "none" }}
              style={{ textDecoration: "none" }}
            >
              <FaHome style={{ marginRight: "8px" }} />
              Go to Homepage
            </Button>
            <Button
              as={RouterLink}
              to="/search"
              variant="outline"
              colorScheme="brand"
              size="lg"
              _hover={{ textDecoration: "none" }}
              style={{ textDecoration: "none" }}
            >
              <FaSearch style={{ marginRight: "8px" }} />
              Search Cards
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
