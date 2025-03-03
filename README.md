# Pokémon TCG Collector

A React application for managing your Pokémon Trading Card Game collection. Search for cards, create collections, track card values, and more.

## Features

- **Search Cards**: Search for Pokémon cards by name, set, type, rarity, and more.
- **Collection Management**: Create multiple collections to organize your cards.
- **Card Details**: View detailed information about each card, including pricing data.
- **Value Tracking**: Monitor the total value of your collection and individual cards.
- **Quantity Management**: Track how many of each card you own and update quantities easily.
- **Price History**: View price history charts for cards (PSA 10 graded).

## Technologies Used

- React
- React Router
- Chart.js
- Styled Components
- Pokémon TCG API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd pokemon-tcg-collector
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Searching for Cards

1. Navigate to the Search page
2. Enter a card name or use the filters to narrow down your search
3. Browse through the results
4. Click on a card to view details or add it to your collection

### Managing Collections

1. Navigate to the Collections page
2. Create a new collection using the "New Collection" button
3. Add cards to your collection from the search page
4. View collection statistics and card breakdown
5. Update card quantities or remove cards as needed

## API Information

This application uses the [Pokémon TCG API](https://pokemontcg.io/) to fetch card data. The API provides information about Pokémon cards, including images, prices, and other details.

If you plan to use this application extensively, consider signing up for an API key at [https://pokemontcg.io/](https://pokemontcg.io/) and adding it to the `src/services/api.js` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Pokémon TCG API](https://pokemontcg.io/) for providing the card data
- [React](https://reactjs.org/) for the UI library
- [Chart.js](https://www.chartjs.org/) for the charts
- [Styled Components](https://styled-components.com/) for styling
