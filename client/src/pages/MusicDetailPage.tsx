import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px; /* Adjust overall margin as needed */
  width: calc(100vw - 350px);
  color: white;
`;

const CoverImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 50px; /* Adjust margin between image and text */
`;

const DetailsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 600px;
  
  h2 {
    font-size: 2rem; /* Increase font size */
    margin-bottom: 10px; /* Increase margin for better spacing */
    color: #61dafb;
  }

  p {
    font-size: 1.2rem; /* Increase font size */
    margin-bottom: 10px; /* Increase margin for better spacing */
    color: #ccc;
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  max-width: 100%;
  height: 100px;
  margin-top: 10px;
`;

const MusicDetail: React.FC = () => {
  const musicDetails = {
    title: 'Song 1',
    artist: 'Artist 1',
    album: 'Album 1',
    coverImg:
      'https://res.cloudinary.com/dvzhoifgr/image/upload/v1699652474/images/ueluum4lwtk7txqw9cew.png',
    musicUrl:
      'https://res.cloudinary.com/dvzhoifgr/video/upload/v1699652472/audio/hwdhqlgp6kovawsisn0i.mp3',
  };

  return (
    <Container>
      <CoverImage src={musicDetails.coverImg} alt="Album Cover" />
      <DetailsContainer>
        <h2>{musicDetails.title}</h2>
        <p>Album: {musicDetails.album}</p>
        <p>Artist: {musicDetails.artist}</p>
        <AudioPlayer controls>
          <source src={musicDetails.musicUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </AudioPlayer>
      </DetailsContainer>
    </Container>
  );
};

export default MusicDetail;
