import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import MusicPage from './pages/Music';
import MusicDetailPage from './pages/MusicDetailPage';
import Home from './pages/Home';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import Statistics from './pages/Statistics';
import LoginPage from './pages/Login';
import NewMusic from './pages/NewMusic';
import MyStat from './pages/MyStat';
import MyMusic from './pages/MyMusic';

const globalStyles = css`
  /* Add your global styles here */
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #1E1E1E;
    height: 100%;
  }
`;

const RootContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 20px;
  // flex-grow: 1; /* Use flex-grow to fill remaining space */
`;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RootContainer>
        <Global styles={globalStyles} />
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path='/music' element={<MusicPage />} />
            <Route path="/music/:id" element={<MusicDetailPage />} />
            <Route path="/mymusic/:id" element={<MyMusic />} />
            <Route path="/mystat/:id" element={<MyStat />} />
            <Route path="/newmusic/:id" element={<NewMusic />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MainContent>
      </RootContainer>
    </BrowserRouter>
  );
};

export default App;
