import React from 'react';
import styled from '@emotion/styled';

interface StarProps {
  filled: boolean;
  onClick: () => void;
}

const StarContainer = styled.div`
  display: inline-block;
`;

const Star = styled.span<StarProps>`
  font-size: 2rem;
  color: ${(props) => (props.filled ? '#FFD700' : '#C0C0C0')};
  cursor: pointer;
`;

interface StarRatingProps {
  rating: number;
  onStarClick: (selectedRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onStarClick }) => {
  const [selectedRating, setSelectedRating] = React.useState(rating);

  const handleStarClick = (clickedRating: number) => {
    setSelectedRating(clickedRating);
    onStarClick(clickedRating);
  };

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          filled={index <= selectedRating}
          onClick={() => handleStarClick(index)}
        >
          &#9733;
        </Star>
      ))}
    </StarContainer>
  );
};

export default StarRating;
