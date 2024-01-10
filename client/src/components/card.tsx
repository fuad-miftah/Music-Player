import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

type CardProps = {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  rating: number;
};

const CardContainer = styled(Link)`
  background-color: #05386B;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 230px; /* Decreased width */
  cursor: pointer; /* Add cursor pointer for better UX */
  text-decoration: none; /* Remove underline */
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ArtistName = styled.p`
  font-size: 1rem;
  color: #EDF5E1;
`;

const ArtistRatingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const Rating = styled.div`
  font-size: 1rem;
  color: #FFD700; /* Set the color to gold or adjust as needed */
`;

const Card: React.FC<CardProps> = ({ id, imageUrl, title, artist }) => (
  <CardContainer to={`/music/${id}`}>
    <CardImage src={imageUrl} alt="Album Art" />
    <CardContent>
      <Title>{title}</Title>
      <ArtistRatingContainer>
      <ArtistName>{artist}</ArtistName>
      <Rating>{(rating).toFixed(1)}</Rating>
      </ArtistRatingContainer>
    </CardContent>
  </CardContainer>
);

export default Card;
