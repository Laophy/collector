import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const CollectionContext = createContext();

// Custom hook to use the collection context
export const useCollections = () => useContext(CollectionContext);

// Collection provider component
export const CollectionProvider = ({ children }) => {
  // State for collections
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);

  // Load collections from localStorage on initial render
  useEffect(() => {
    const savedCollections = localStorage.getItem("pokemonCollections");
    if (savedCollections) {
      const parsedCollections = JSON.parse(savedCollections);
      setCollections(parsedCollections);

      // Set active collection to the first one if it exists
      if (parsedCollections.length > 0) {
        setActiveCollection(parsedCollections[0].id);
      }
    }
  }, []);

  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pokemonCollections", JSON.stringify(collections));
  }, [collections]);

  // Create a new collection
  const createCollection = (name, description = "") => {
    const newCollection = {
      id: Date.now().toString(),
      name,
      description,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCollections([...collections, newCollection]);
    setActiveCollection(newCollection.id);
    return newCollection;
  };

  // Update a collection
  const updateCollection = (id, updates) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === id) {
        return {
          ...collection,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return collection;
    });

    setCollections(updatedCollections);
  };

  // Delete a collection
  const deleteCollection = (id) => {
    const filteredCollections = collections.filter(
      (collection) => collection.id !== id
    );
    setCollections(filteredCollections);

    // If the active collection is deleted, set the first available collection as active
    if (activeCollection === id && filteredCollections.length > 0) {
      setActiveCollection(filteredCollections[0].id);
    } else if (filteredCollections.length === 0) {
      setActiveCollection(null);
    }
  };

  // Add a card to a collection
  const addCardToCollection = (collectionId, card, quantity = 1) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        // Check if the card already exists in the collection
        const existingCardIndex = collection.cards.findIndex(
          (c) => c.id === card.id
        );

        if (existingCardIndex !== -1) {
          // Update the quantity if the card already exists
          const updatedCards = [...collection.cards];
          updatedCards[existingCardIndex] = {
            ...updatedCards[existingCardIndex],
            quantity: updatedCards[existingCardIndex].quantity + quantity,
          };

          return {
            ...collection,
            cards: updatedCards,
            updatedAt: new Date().toISOString(),
          };
        } else {
          // Add the new card with the specified quantity
          return {
            ...collection,
            cards: [...collection.cards, { ...card, quantity }],
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return collection;
    });

    setCollections(updatedCollections);
  };

  // Update a card in a collection
  const updateCardInCollection = (collectionId, cardId, updates) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        const updatedCards = collection.cards.map((card) => {
          if (card.id === cardId) {
            return { ...card, ...updates };
          }
          return card;
        });

        return {
          ...collection,
          cards: updatedCards,
          updatedAt: new Date().toISOString(),
        };
      }
      return collection;
    });

    setCollections(updatedCollections);
  };

  // Remove a card from a collection
  const removeCardFromCollection = (collectionId, cardId) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          cards: collection.cards.filter((card) => card.id !== cardId),
          updatedAt: new Date().toISOString(),
        };
      }
      return collection;
    });

    setCollections(updatedCollections);
  };

  // Calculate the total value of a collection
  const calculateCollectionValue = (collectionId) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return 0;

    return collection.cards.reduce((total, card) => {
      const cardPrice =
        card.tcgplayer?.prices?.holofoil?.market ||
        card.tcgplayer?.prices?.normal?.market ||
        card.tcgplayer?.prices?.reverseHolofoil?.market ||
        card.tcgplayer?.prices?.firstEdition?.market ||
        card.tcgplayer?.prices?.unlimited?.market ||
        0;

      return total + cardPrice * card.quantity;
    }, 0);
  };

  // Get the active collection
  const getActiveCollection = () => {
    return collections.find((c) => c.id === activeCollection) || null;
  };

  // Value object to be provided to consumers
  const value = {
    collections,
    activeCollection,
    setActiveCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    updateCardInCollection,
    removeCardFromCollection,
    calculateCollectionValue,
    getActiveCollection,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};

export default CollectionContext;
