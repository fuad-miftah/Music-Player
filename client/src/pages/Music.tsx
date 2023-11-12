import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import styled from '@emotion/styled';
import musicData from '../constant/musicData';


const MusicContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchContainer = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 20px; /* Rounded corners */
  border: 2px solid #ddd; /* Border color */
  outline: none; /* Remove default focus outline */
  margin-right: 10px;
  font-size: 16px;
  transition: border-color 0.3s; /* Smooth transition for border color */

  &:focus {
    border-color: #4285f4; /* Change border color on focus */
  }
`;

const SearchButton = styled.button`
  padding: 10px 16px;
  border-radius: 20px; /* Rounded corners */
  background-color: #000; /* Button background color */
  color: white; /* Button text color */
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s; /* Smooth transition for background color */

  &:hover {
    background-color: #357ae8; /* Change background color on hover */
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
//   justify-content: space-around;
  margin-top: 20px;
  gap: 20px;
  width: 100%; /* Ensure full width */
`;

const PageNumber = styled.span<{ isActive: boolean }>`
  padding: 8px;
  margin: 0 5px;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? 'white' : 'black')};
  background-color: ${({ isActive }) => (isActive ? 'blue' : 'transparent')};
  border-radius: 4px;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? 'blue' : '#ddd')};
  }
`;

const PageNumberContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const MusicPage: React.FC = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(musicData);

  // Calculate total pages whenever search results change
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when search results change
  }, [searchResults]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    // Filter music based on the search term
    const filteredResults = musicData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <MusicContainer>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by title or artist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchContainer>
      <CardsContainer>
        {searchResults.length === 0 ? (
          <p>No results found</p>
        ) : (
          searchResults.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          ).map((item) => (
            <Card
              key={item.id}
              id={String(item.id)}
              imageUrl={item.imageUrl}
              title={item.title}
              artist={item.artist}
            />
          ))
        )}
      </CardsContainer>
      <div>
        <PageNumberContainer>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PageNumber
              key={index}
              isActive={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PageNumber>
          ))}
        </PageNumberContainer>
      </div>
    </MusicContainer>
  );
};

export default MusicPage;
