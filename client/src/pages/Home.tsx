import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import Card from "../components/card";
import styled from "@emotion/styled"
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

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
  padding-bottom: 20px;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`;

const Title = styled.h1`
font-size: 2.5rem;
  color: white;
`;

const ShowAllLink = styled(Link)`
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Added space between the cards */
  margin-top: 10px;
  gap: 20px; /* Added gap between the cards */
`;

const Error = styled.div`
  color: #05386B; 
  padding: 30px;
  margin: 20px 0; 
  font-size: 20em;
`;

const Home: React.FC = () => {
  const { data, loading, error } = useSelector((state: RootState) => state.music);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#05386B" loading={loading} size={150} />
      </div>
    );
  }

  if (error) {
    return <Error>Error</Error>;
  }

  if (!data) {
    return <Error>No data available</Error>;
  }

  const getRandomElements = (array: MusicListItem[], count: number) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const recentMusic = data.musicList.slice(0, 5);

  const remainingMusic = data.musicList.slice(5);
  const randomlyChosenMusic = getRandomElements(remainingMusic, 5);

  return (
    <MainContainer>
      <HomeContainer>
        <Header>
          <Title>Recent Music</Title>
          <ShowAllLink to="/music">Show All</ShowAllLink>
        </Header>
        <CardsContainer>
          {recentMusic.map((item) => (
            <Card
              key={item._id}
              id={String(item._id)}
              imageUrl={item.coverImg.url}
              title={item.title}
              artist={item.artist}
            />
          ))}
        </CardsContainer>
      </HomeContainer>
      <HomeContainer>
        <Header>
          <Title>Randomly Chosen Music</Title>
          <ShowAllLink to="/music">Show All</ShowAllLink>
        </Header>
        <CardsContainer>
          {randomlyChosenMusic.map((item) => (
            <Card
              key={item._id}
              id={String(item._id)}
              imageUrl={item.coverImg.url}
              title={item.title}
              artist={item.artist}
            />
          ))}
        </CardsContainer>
      </HomeContainer>
    </MainContainer>
  );
};

export default Home;
