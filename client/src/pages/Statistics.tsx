import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from '@emotion/styled';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { parseISO } from 'date-fns';

const COLORS = ['#008000', '#FFFF00', '#FF0000', '#0000FF', '#FFA500', '#800080', '#FFC0CB', '#000000', '#FFFFFF', '#8B4513'];

const PageContainer = styled.div`
  color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledHeader = styled.h1`
font-size: 2.5rem;
  color: white;
  text-align: center;
`;

const StyledSubHeader = styled.h3`
font-size: 2rem;
color: white;
  text-align: center;
  align-self: center;
`;

const CircleStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  background-color: #05386B;
  border-radius: 50%;
  margin: 10px;
`;

const StatLabel = styled.h2`
  margin: 0;
`;

const SectionContainer = styled.div`
  margin-bottom: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Error = styled.div`
  color: #05386B; 
  padding: 30px;
  margin: 20px 0; 
  font-size: 20em;
`;

const Statistics: React.FC = () => {

  const musicData = useSelector((state: RootState) => state.music.data);
  

  if (!musicData) {
    return <Error>No Data</Error>
  }

  const timeBasedData = musicData.musicList.map((music) => ({
    date: parseISO(music.createdAt),
    totalSongs: musicData.musicList.filter(
      (item) => parseISO(item.createdAt) <= parseISO(music.createdAt)
    ).length,
  }));

  return (
    <PageContainer>
      <StyledHeader>Music Statistics</StyledHeader>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <CircleStat>
          <StatLabel>Total Songs</StatLabel>
          <StatLabel>{musicData.totalSongs}</StatLabel>
        </CircleStat>

        <CircleStat>
          <StatLabel>Total Artists</StatLabel>
          <StatLabel>{musicData.totalArtists}</StatLabel>
        </CircleStat>

        <CircleStat>
          <StatLabel>Total Albums</StatLabel>
          <StatLabel>{musicData.totalAlbums}</StatLabel>
        </CircleStat>
      </div>

      <SectionContainer>
        <StyledSubHeader>Songs in Each Genre</StyledSubHeader>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={musicData.songsInEachGenre}>
            <XAxis dataKey="genre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#05386B" />
          </BarChart>
        </ResponsiveContainer>
      </SectionContainer>

      <SectionContainer>
        <StyledSubHeader>Artists Statistics</StyledSubHeader>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={musicData.artistStats}
              dataKey="totalSongs"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {musicData.artistStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </SectionContainer>

      <SectionContainer>
        <StyledSubHeader>Albums Statistics</StyledSubHeader>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={musicData.albumStats}
              dataKey="songs.length"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {musicData.albumStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </SectionContainer>

      <SectionContainer>
        <StyledSubHeader>Increase in Songs Over Time</StyledSubHeader>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timeBasedData}>
            <XAxis dataKey="date" type="category" scale="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSongs" stroke="#05386B" />
          </LineChart>
        </ResponsiveContainer>
      </SectionContainer>
    </PageContainer>
  );
};


export default Statistics;
