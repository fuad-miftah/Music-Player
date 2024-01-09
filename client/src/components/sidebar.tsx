import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaChartBar, FaMusic } from 'react-icons/fa';
import { MdFiberNew } from 'react-icons/md';
import styled from '@emotion/styled';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { logout } from '../reducers/authSlice';
import { RootState } from '../reducers/rootReducer';

interface SidebarItemContainerProps extends NavLinkProps {
  activeClassName: string;
}

const SidebarContainer = styled.div`
  background-color: #8EE4AF;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push items to the top and bottom */
`;

const Content = styled.div`
  margin-top: 20px;
`;

const SidebarItemContainer = styled(NavLink)<SidebarItemContainerProps>`
  display: flex;
  align-items: center;
  background-color: #05386B;
  font-size: 16px;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  margin: 0 10px 15px;
  transition: background-color 0.3s, color 0.3s;

  > svg {
    margin-right: 10px;
  }

  text-decoration: none;
  color: white;

  &:hover {
    background-color: #5CDB95;
  }

  &.active {
    background-color: #379683;
    color: white;
  }
`;

const UserName = styled.span`
  color: #05386B;
  font-size: 14px;
  margin-bottom: 5px;
`;

const UserContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoutButton = styled.button`
  background-color: #05386B;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;

  &:hover {
    background-color: #303030;
  }
`;

const LoginButton = styled.button`
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  background-color: #05386B;

  &:hover {
    background-color: #303030;
  }
`;

const Title = styled.h1`
font-size: 1.2rem;
  color: white;
  margin-left: 15px;
`;

const SidebarItem = ({ Icon, Text, to }: { Icon: React.ElementType; Text: string; to: string }) => (
  <SidebarItemContainer to={to} activeClassName="active">
    <Icon />
    {Text}
  </SidebarItemContainer>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userName = storedUser?.username || '';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SidebarContainer>
      <Content>
        <Title><FaMusic /> HarmoniSync</Title>
        <SidebarItem Icon={FaHome} Text="Home" to="/" />
        <SidebarItem Icon={FaChartBar} Text="Statistics" to="/statistics" />
        <SidebarItem Icon={FaMusic} Text="Music" to="/music" />
        {isAuthenticated && <SidebarItem Icon={FaChartBar} Text="My Stat" to={`/mystat/${storedUser?._id}`} />}
        {isAuthenticated && <SidebarItem Icon={FaMusic} Text="My Music" to={`/mymusic/${storedUser?._id}`} />}
        {isAuthenticated && <SidebarItem Icon={MdFiberNew} Text="Create Music" to={`/newmusic/${storedUser?._id}`} />}
      </Content>

      {isAuthenticated ? (
        <UserContainer>
          <UserName>{userName}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserContainer>
      ) : (
        <div style={{ padding: '10px' }}>
          <NavLink to="/login">
            <LoginButton>Login</LoginButton>
          </NavLink>
        </div>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
