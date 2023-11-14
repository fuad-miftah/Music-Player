import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { fetchDataStart } from '../reducers/musicSlice';
import Card from "../components/card";
import styled from "@emotion/styled"
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Added space between the cards */
  margin-top: 10px;
  gap: 20px; /* Added gap between the cards */
`;

const Home: React.FC = () => {
  // const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.music);

  // useEffect(() => {
  //   dispatch(fetchDataStart());
  // }, [dispatch]);

  console.log("data", data);

  

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#61dafb" loading={loading} size={150} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }


  return (
    <div>
      <HomeContainer>
        <Header>
          <Title>Recent Music</Title>
          <ShowAllLink to="/all-recent-music">Show All</ShowAllLink>
        </Header>
        <CardsContainer>
          {data.data.musicList.slice(0, 5).map((item) => (
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
          <Title>Recent Music</Title>
          <ShowAllLink to="/all-recent-music">Show All</ShowAllLink>
        </Header>
        <CardsContainer>
          {data.data.musicList.slice(0, 5).map((item) => (
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
    </div>
  );
};

export default Home;


