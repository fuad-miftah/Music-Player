// Statistics.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from '@emotion/styled';

// Define styled components
const Container = styled.div`
  color: white;
`;

const Heading1 = styled.h1`
  color: #61dafb; /* You can use your preferred color */
`;

const Heading2 = styled.h2`
  color: #61dafb; /* You can use your preferred color */
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
      <p>Total Songs: {musicData.totalSongs}</p>
      <p>Total Artists: {musicData.totalArtists}</p>
      <p>Total Albums: {musicData.totalAlbums}</p>

      <Heading2>Genres</Heading2>
      <ul>
        {musicData.uniqueGenres.map((genre, index) => (
          <ListItem key={index}>
            {genre}: {musicData.songsInEachGenre.find((g) => g.genre === genre)?.count || 0} songs
          </ListItem>
        ))}
      </ul>

      <Heading2>Top Artists</Heading2>
      <ul>
        {musicData.artistStats.map((artist) => (
          <ListItem key={artist._id}>
            {artist._id}: {artist.totalSongs} songs
          </ListItem>
        ))}
      </ul>

      <Heading2>Top Albums</Heading2>
      <ul>
        {musicData.albumStats.map((album) => (
          <ListItem key={album._id}>
            {album._id}: {album.songs.length} songs
          </ListItem>
        ))}
      </ul>
    </Container>
  );
};

export default Statistics;
