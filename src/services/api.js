import axios from "axios";

const API_URL = "https://api.pokemontcg.io/v2";

// Create axios instance with base URL and headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    // If you have an API key, uncomment the line below and add your key
    "X-Api-Key": "c14d1045-56af-4f05-ba6d-715df872a20c",
  },
});

// Search cards with various parameters
export const searchCards = async (params) => {
  try {
    // Build the query string according to the Pokémon TCG API format
    let queryString = "";

    if (params.q && params.q.trim() !== "") {
      queryString += `name:"${params.q}"`;
    }

    if (params.types) {
      if (queryString) queryString += " ";
      queryString += `types:"${params.types}"`;
    }

    if (params.rarity) {
      if (queryString) queryString += " ";
      queryString += `rarity:"${params.rarity}"`;
    }

    if (params.set) {
      if (queryString) queryString += " ";
      queryString += `set.id:"${params.set}"`;
    }

    const response = await apiClient.get("/cards", {
      params: {
        q: queryString,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error searching cards:", error);
    throw error;
  }
};

// Get a single card by ID
export const getCardById = async (id) => {
  try {
    const response = await apiClient.get(`/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting card:", error);
    throw error;
  }
};

// Get card sets
export const getSets = async () => {
  try {
    const response = await apiClient.get("/sets");
    return response.data;
  } catch (error) {
    console.error("Error getting sets:", error);
    throw error;
  }
};

// Get card rarities
export const getRarities = async () => {
  try {
    const response = await apiClient.get("/rarities");
    return response.data;
  } catch (error) {
    console.error("Error getting rarities:", error);
    throw error;
  }
};

// Get card types
export const getTypes = async () => {
  try {
    const response = await apiClient.get("/types");
    return response.data;
  } catch (error) {
    console.error("Error getting types:", error);
    throw error;
  }
};

// Get card subtypes
export const getSubtypes = async () => {
  try {
    const response = await apiClient.get("/subtypes");
    return response.data;
  } catch (error) {
    console.error("Error getting subtypes:", error);
    throw error;
  }
};

// Get card supertypes
export const getSupertypes = async () => {
  try {
    const response = await apiClient.get("/supertypes");
    return response.data;
  } catch (error) {
    console.error("Error getting supertypes:", error);
    throw error;
  }
};

export default {
  searchCards,
  getCardById,
  getSets,
  getRarities,
  getTypes,
  getSubtypes,
  getSupertypes,
};
