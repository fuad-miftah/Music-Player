import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import RegistrationPage from './pages/Register';
import { fetchDataStart } from './reducers/musicSlice';
import { verifyUserStart } from './reducers/authSlice';

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
  background-color: #1E1E1E;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 20px;
  // flex-grow: 1; /* Use flex-grow to fill remaining space */
`;

const SidebarLayout = () => (
  <>
    <Global styles={globalStyles} />
    <Sidebar />
    <Outlet />
  </>
);

const App: React.FC = () => {
  const dispatch = useDispatch();

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const _id: string = storedUser?._id;

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      console.log("verify user");
      
      dispatch(verifyUserStart({ _id}));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDataStart());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <RootContainer>
        <MainContent>
          <Routes>
            <Route path="/" element={<SidebarLayout />}>
              <Route index element={<Home />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path='/music' element={<MusicPage />} />
              <Route path="/music/:id" element={<MusicDetailPage />} />
              <Route path="/mymusic/:id" element={<MyMusic />} />
              <Route path="/mystat/:id" element={<MyStat />} />
              <Route path="/newmusic/:id" element={<NewMusic />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </MainContent>
      </RootContainer>
    </BrowserRouter>
  );
};

export default App;
