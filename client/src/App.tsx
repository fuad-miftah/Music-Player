import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import axios from 'axios';
import { RootState } from './reducers/rootReducer';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';

const globalStyles = css`
  /* Add your global styles here */
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #5CDB95;
    height: 100%;
    color: white;
  }
`;

const RootContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #5CDB95;
  color: white;
`;

const MainContent = styled.div`
  margin-left: 250px;
  padding: 20px;
  // flex-grow: 1; /* Use flex-grow to fill remaining space */
`;

const PrivateRoute = ({ element, roles }: { element: React.ReactNode; roles: string[] }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = storedUser?.role;
  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    // Redirect to a page indicating unauthorized access
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

const SidebarLayout = () => (
  <>
    <Global styles={globalStyles} />
    <Sidebar />
    <Outlet />
  </>
);

const App: React.FC = () => {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      dispatch(verifyUserStart({ _id: storedUser._id }));
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
              <Route index element={<PrivateRoute element={<Home />} roles={["Client", "Admin"]} />} />
              <Route path="/statistics" element={<PrivateRoute element={<Statistics />} roles={['Admin']} />} />
              <Route path='/music' element={<PrivateRoute element={<MusicPage />} roles={["Client", "Admin"]} />}  />
              <Route path='/updateprofile/:id' element={<PrivateRoute element={<UserDetail />} roles={["Client", "Admin"]} />}  />
              <Route path="/music/:id" element={<MusicDetailPage />} />
              <Route path="/mymusic/:id" element={<PrivateRoute element={<MyMusic />} roles={['Admin']} />} />
              <Route path="/mystat/:id" element={<PrivateRoute element={<MyStat />} roles={['Admin']} />} />
              <Route path="/newmusic/:id" element={<PrivateRoute element={<NewMusic />} roles={['Admin']} />} />
              <Route path="/usermanagment" element={<PrivateRoute element={<UserList />} roles={['Admin']} />} />
              <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
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
