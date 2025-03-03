import React from "react";
import styled from "styled-components";
import Card from "./Card";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  grid-column: 1 / -1;
  min-height: 200px;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  color: #555;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777;
`;

const CardGrid = ({
  cards,
  inCollection = false,
  onAddToCollection,
  onRemoveFromCollection,
  onUpdateQuantity,
  onViewDetails,
}) => {
  if (!cards || cards.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyStateTitle>No Cards Found</EmptyStateTitle>
          <EmptyStateText>
            {inCollection
              ? "Your collection is empty. Search for cards to add to your collection."
              : "No cards match your search criteria. Try adjusting your filters."}
          </EmptyStateText>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          inCollection={inCollection}
          quantity={card.quantity || 1}
          onAddToCollection={onAddToCollection}
          onRemoveFromCollection={onRemoveFromCollection}
          onUpdateQuantity={onUpdateQuantity}
          onViewDetails={onViewDetails}
        />
      ))}
    </GridContainer>
  );
};

export default CardGrid;
