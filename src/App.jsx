import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { CollectionProvider } from "./contexts/CollectionContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CollectionsPage from "./pages/CollectionsPage";
import NewCollectionPage from "./pages/NewCollectionPage";
import EditCollectionPage from "./pages/EditCollectionPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import PackOpeningPage from "./pages/PackOpeningPage";
import NotFoundPage from "./pages/NotFoundPage";
import theme from "./theme";
import "./App.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CollectionProvider>
        <Router>
          <Box bg="background.primary" minH="100vh">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/new" element={<NewCollectionPage />} />
              <Route
                path="/collections/edit/:id"
                element={<EditCollectionPage />}
              />
              <Route
                path="/collections/:id"
                element={<CollectionDetailPage />}
              />
              <Route path="/packs" element={<PackOpeningPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Router>
      </CollectionProvider>
    </ChakraProvider>
  );
}

export default App; 