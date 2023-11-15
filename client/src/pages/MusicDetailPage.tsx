import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataStart } from '../reducers/musicSlice';
import { ClipLoader } from 'react-spinners';
import Card from '../components/card';
import { Link } from 'react-router-dom';

interface CoverImage {
  public_id: string;
  url: string;
}

interface Audio {
  public_id: string;
  url: string;
}

interface MusicListItem {
  coverImg: CoverImage;
  audio: Audio;
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  width: calc(100vw - 350px);
  color: white;
`;

const CoverImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 50px;
`;

const DetailsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 600px;

  h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #61dafb;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #ccc;
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  max-width: 100%;
  height: 100px;
  margin-top: 10px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Added space between the cards */
  margin-top: 10px;
  gap: 20px; /* Added gap between the cards */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  
`;

const Title = styled.h1`
  flex-grow: 1;
  color: #61dafb;
`;

const ShowAllLink = styled(Link)`
  color: #61dafb;
  text-decoration: none;
  cursor: pointer;
`;

const MusicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.music);
  const [musicDetail, setMusicDetail] = useState<MusicListItem | undefined>(undefined);

  useEffect(() => {
    if (!data) {
      dispatch(fetchDataStart());
    } else {
      const selectedMusic = data.musicList.find((music) => music._id === id);
      setMusicDetail(selectedMusic);
    }
  }, [dispatch, data, id]);

  const getSuggestedMusic = (): MusicListItem[] => {
    const suggestedMusic: MusicListItem[] = [];
  
    if (!data) {
      return suggestedMusic;
    }
  
    const uniqueMusicIds = new Set<string>();
  
    const addUniqueMusic = (musicList: MusicListItem[]) => {
      musicList.forEach((music) => {
        if (!uniqueMusicIds.has(music._id) && suggestedMusic.length < 5) {
          suggestedMusic.push(music);
          uniqueMusicIds.add(music._id);
        }
      });
    };
  
    const sameAlbumMusic = data.musicList.filter((music) => music.album === musicDetail?.album);
    addUniqueMusic(sameAlbumMusic.slice(0, 5));
  
    const sameArtistMusic = data.musicList.filter((music) => music.artist === musicDetail?.artist);
    addUniqueMusic(sameArtistMusic.slice(0, 5));
  
    const sameGenreMusic = data.musicList.filter((music) => music.genre === musicDetail?.genre);
    addUniqueMusic(sameGenreMusic.slice(0, 5));
  
    const remainingMusic = data.musicList.filter((music) => !uniqueMusicIds.has(music._id));
    addUniqueMusic(remainingMusic.slice(0, 5));
  
    return suggestedMusic;
  };
  
  
  

  const suggestedMusic = getSuggestedMusic();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#61dafb" loading={loading} size={150} />
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!musicDetail) {
    return <div>Music not found</div>;
  }

  return (
    <MainContainer>
    <Container>
      <CoverImage src={musicDetail.coverImg.url} alt="Album Cover" />
      <DetailsContainer>
        <h2>{musicDetail.title}</h2>
        <p>Album: {musicDetail.album}</p>
        <p>Artist: {musicDetail.artist}</p>
        <AudioPlayer controls>
          <source src={musicDetail.audio.url} type="audio/mp3" />
          Your browser does not support the audio element.
        </AudioPlayer>
      </DetailsContainer>
      
    </Container>
    <Header>
          <Title>Suggested Music</Title>
          <ShowAllLink to="/all-recent-music">Show All</ShowAllLink>
        </Header>
        <CardsContainer>
          {suggestedMusic.map((music) => (
            <Card
              key={music._id}
              id={music._id}
              imageUrl={music.coverImg.url}
              title={music.title}
              artist={music.artist}
            />
          ))}
        </CardsContainer>
    </MainContainer>
  );
};

export default MusicDetail;
