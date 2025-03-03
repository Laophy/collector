import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Container,
  Image,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  FaHome,
  FaSearch,
  FaLayerGroup,
  FaBars,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";

// Global style to remove focus outline
const globalStyles = `
  :focus:not(:focus-visible) {
    box-shadow: none !important;
    outline: none !important;
  }
  
  :focus-visible {
    box-shadow: 0 0 0 3px var(--chakra-colors-brand-300) !important;
    outline: none !important;
  }
`;

const NavLink = ({ children, to, icon, isActive }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      px={4}
      py={2}
      color={isActive ? "brand.400" : "gray.200"}
      fontWeight={isActive ? "bold" : "medium"}
      transition="all 0.2s"
      borderBottom={isActive ? "2px solid" : "2px solid transparent"}
      borderColor={isActive ? "brand.400" : "transparent"}
      _hover={{
        textDecoration: "none",
        color: isActive ? "brand.300" : "white",
      }}
      _focus={{
        boxShadow: "none",
        outline: "none",
      }}
      _focusVisible={{
        boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
      }}
      display="flex"
      alignItems="center"
      gap={2}
    >
      <Box color={isActive ? "brand.400" : "gray.400"}>{icon}</Box>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const Links = [
    { name: "Home", to: "/", icon: <FaHome size={16} /> },
    { name: "Search", to: "/search", icon: <FaSearch size={16} /> },
    {
      name: "Collections",
      to: "/collections",
      icon: <FaLayerGroup size={16} />,
    },
    {
      name: "Open Packs",
      to: "/packs",
      icon: <FaBoxOpen size={16} />,
    },
  ];

  return (
    <Box as="nav" width="100%">
      {/* Add global styles */}
      <style>{globalStyles}</style>

      <Container maxW="container.xl" py={4}>
        <Flex alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={onOpen}
            icon={<FaBars />}
            variant="ghost"
            color="white"
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
            }}
          />

          <HStack spacing={4} alignItems="center">
            <Box>
              <RouterLink to="/" style={{ textDecoration: "none" }}>
                <Flex alignItems="center" gap={2}>
                  <Image
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                    alt="Pokemon TCG"
                    height="30px"
                    width="30px"
                    objectFit="contain"
                  />
                  <Text fontWeight="bold" fontSize="xl" color="white">
                    TCG Collector
                  </Text>
                </Flex>
              </RouterLink>
            </Box>

            <HStack
              as="nav"
              spacing={2}
              display={{ base: "none", md: "flex" }}
              ml={8}
            >
              {Links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  icon={link.icon}
                  isActive={location.pathname === link.to}
                >
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Button
            as={RouterLink}
            to="/collections/new"
            size="sm"
            colorScheme="brand"
            display={{ base: "none", md: "inline-flex" }}
            leftIcon={<FaPlus />}
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
            }}
            style={{ textDecoration: "none" }}
          >
            Add Collection
          </Button>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="background.primary">
          <DrawerCloseButton
            color="white"
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
            }}
          />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            <Text color="white">Menu</Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            {Links.map((link) => (
              <Link
                key={link.name}
                as={RouterLink}
                to={link.to}
                onClick={onClose}
                py={3}
                px={4}
                display="flex"
                alignItems="center"
                color={location.pathname === link.to ? "brand.400" : "white"}
                bg={
                  location.pathname === link.to
                    ? "background.tertiary"
                    : "transparent"
                }
                _hover={{
                  textDecoration: "none",
                  bg: "background.tertiary",
                }}
                _focus={{
                  boxShadow: "none",
                  outline: "none",
                }}
                _focusVisible={{
                  boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
                }}
                style={{ textDecoration: "none" }}
              >
                <Box
                  mr={3}
                  color={
                    location.pathname === link.to ? "brand.400" : "gray.400"
                  }
                >
                  {link.icon}
                </Box>
                <Text>{link.name}</Text>
              </Link>
            ))}
            <Box p={4}>
              <Button
                as={RouterLink}
                to="/collections/new"
                size="sm"
                colorScheme="brand"
                w="full"
                leftIcon={<FaPlus />}
                onClick={onClose}
                _focus={{
                  boxShadow: "none",
                  outline: "none",
                }}
                _focusVisible={{
                  boxShadow: "0 0 0 3px var(--chakra-colors-brand-300)",
                }}
                style={{ textDecoration: "none" }}
              >
                Add Collection
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
