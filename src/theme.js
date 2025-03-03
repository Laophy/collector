import { extendTheme } from "@chakra-ui/react";

// Custom color palette
const colors = {
  brand: {
    50: "#ffe0e0",
    100: "#ffb8b8",
    200: "#ff9090",
    300: "#ff6868",
    400: "#ff4040",
    500: "#ff3333",
    600: "#e62e2e",
    700: "#cc2929",
    800: "#b32424",
    900: "#991f1f",
  },
  pokemon: {
    fire: "#FF5733",
    water: "#3498DB",
    grass: "#2ECC71",
    electric: "#F1C40F",
    psychic: "#9B59B6",
    fighting: "#E74C3C",
    normal: "#95A5A6",
    dark: "#34495E",
  },
  gray: {
    50: "#f2f2f2",
    100: "#d9d9d9",
    200: "#bfbfbf",
    300: "#a6a6a6",
    400: "#8c8c8c",
    500: "#737373",
    600: "#595959",
    700: "#404040",
    800: "#262626",
    900: "#0d0d0d",
  },
  background: {
    primary: "#1a1a1a",
    secondary: "#2a2a2a",
    tertiary: "#333333",
  },
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "md",
    },
    variants: {
      solid: (props) => ({
        bg:
          props.colorScheme === "brand"
            ? "brand.500"
            : `${props.colorScheme}.500`,
        color: "white",
        _hover: {
          bg:
            props.colorScheme === "brand"
              ? "brand.600"
              : `${props.colorScheme}.600`,
        },
      }),
      outline: (props) => ({
        borderColor:
          props.colorScheme === "brand"
            ? "brand.500"
            : `${props.colorScheme}.500`,
        color:
          props.colorScheme === "brand"
            ? "brand.500"
            : `${props.colorScheme}.500`,
      }),
    },
    defaultProps: {
      colorScheme: "brand",
    },
  },
  Card: {
    baseStyle: {
      p: "4",
      borderRadius: "lg",
      boxShadow: "md",
      bg: "background.secondary",
      color: "white",
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "700",
      color: "white",
    },
  },
  Text: {
    baseStyle: {
      color: "gray.100",
    },
  },
  Menu: {
    baseStyle: {
      list: {
        bg: "background.tertiary",
        borderColor: "gray.700",
      },
      item: {
        bg: "background.tertiary",
        _hover: { bg: "background.primary" },
        _focus: { bg: "background.primary" },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: "background.secondary",
      },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: "background.tertiary",
      color: "white",
    },
  },
  Badge: {
    baseStyle: {
      bg: "brand.500",
      color: "white",
    },
  },
};

// Global style overrides
const styles = {
  global: {
    body: {
      bg: "background.primary",
      color: "white",
    },
    a: {
      color: "brand.300",
      _hover: {
        textDecoration: "underline",
      },
    },
    // Add scrollbar styling
    "::-webkit-scrollbar": {
      width: "10px",
      height: "10px",
    },
    "::-webkit-scrollbar-track": {
      background: "background.primary",
    },
    "::-webkit-scrollbar-thumb": {
      background: "background.tertiary",
      borderRadius: "6px",
      border: "2px solid",
      borderColor: "background.primary",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "gray.700",
    },
    // Firefox scrollbar
    "*": {
      scrollbarWidth: "thin",
      scrollbarColor:
        "var(--chakra-colors-background-tertiary) var(--chakra-colors-background-primary)",
    },
  },
};

// Theme configuration
const theme = extendTheme({
  colors,
  components,
  styles,
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Open Sans', sans-serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
