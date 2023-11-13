import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from '@emotion/styled';

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Heading1 = styled.h1`
  color: #61dafb;
  margin-bottom: 20px;
`;

const Heading2 = styled.h2`
  color: #61dafb;
  margin-top: 20px;
`;

const LargeCardContainer = styled.div`
  display: flex;
  justify-content: space-between;

`;

const LargeCard = styled.div`
  background-color: #333;
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  width: 80%;
  margin: 20px;
`;

const SmallCardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
`;

const SmallCard = styled.div`
  background-color: #333;
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 45%;
  margin: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const Statistics: React.FC = () => {
  const musicData = useSelector((state: RootState) => state.music.data);

  if (!musicData) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Heading1>Music Statistics</Heading1>
      <LargeCardContainer>
      <LargeCard>
        <h3>Total Songs</h3>
        <p>{musicData.totalSongs}</p>
      </LargeCard>

      <LargeCard>
        <h3>Total Artists</h3>
        <p>{musicData.totalArtists}</p>
      </LargeCard>

      <LargeCard>
        <h3>Total Albums</h3>
        <p>{musicData.totalAlbums}</p>
      </LargeCard>
      </LargeCardContainer>
      <Heading2>Genres</Heading2>

      <SmallCardContainer>
        {musicData.uniqueGenres.map((genre, index) => (
          <SmallCard key={index}>
            <h3>{genre}</h3>
            <p>{musicData.songsInEachGenre.find((g) => g.genre === genre)?.count || 0} songs</p>
          </SmallCard>
        ))}
      </SmallCardContainer>

      <Heading2>Top Artists</Heading2>
      <SmallCardContainer>
        {musicData.artistStats.map((artist) => (
          <SmallCard key={artist._id}>
            <h3>{artist._id}</h3>
            <p>{artist.totalSongs} songs</p>
          </SmallCard>
        ))}
      </SmallCardContainer>

      <Heading2>Top Albums</Heading2>
      <SmallCardContainer>
        {musicData.albumStats.map((album) => (
          <SmallCard key={album._id}>
            <h3>{album._id}</h3>
            <p>{album.songs.length} songs</p>
          </SmallCard>
        ))}
      </SmallCardContainer>
    </Container>
  );
};

export default Statistics;
