import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

const MyStat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [musicData, setMusicData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/api/music/clientwithstat/${id}`,
          { withCredentials: true }
        );

        setMusicData(response.data.data);
      } catch (error) {
        console.error('Error fetching music data:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    fetchData();
  }, [id]);

  if (!musicData) {
    return <div>Loading...</div>;
  }

  console.log("musicdata.uniqueGenres", musicData.uniqueGenres);
  
  return (
    <Container>
      <Heading1>Music Details</Heading1>
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
        {musicData.uniqueGenres.map((genre: string, index: number) => (
          <SmallCard key={index}>
            <h3>{genre}</h3>
            <p>{musicData.songsInEachGenre.find((g: any) => g.genre === genre)?.count || 0} songs</p>
          </SmallCard>
        ))}
      </SmallCardContainer>

      <Heading2>Top Artists</Heading2>
      <SmallCardContainer>
        {musicData.artistStats.length > 0 ? (
          musicData.artistStats.map((artist: any) => (
            <SmallCard key={artist._id}>
              <h3>{artist._id}</h3>
              <p>{artist.totalSongs} songs</p>
            </SmallCard>
          ))
        ) : (
          <div>No artist stats available</div>
        )}
      </SmallCardContainer>

      <Heading2>Top Albums</Heading2>
      <SmallCardContainer>
        {musicData.albumStats.length > 0 ? (
          musicData.albumStats.map((album: any) => (
            <SmallCard key={album._id}>
              <h3>{album._id}</h3>
              <p>{album.songs.length} songs</p>
            </SmallCard>
          ))
        ) : (
          <div>No album stats available</div>
        )}
      </SmallCardContainer>
    </Container>
  );
};

export default MyStat;
