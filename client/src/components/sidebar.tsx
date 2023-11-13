// Sidebar.tsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { FaHome, FaChartBar, FaMusic } from 'react-icons/fa';
import { MdFiberNew} from 'react-icons/md';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { logout } from '../reducers/authSlice';


const SidebarContainer = styled.div`
  background-color: #1a1a1a;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  margin-top: 60px;
`;

const UserContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto; /* Push to the bottom */
`;

const SidebarItemContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  background-color: #232323;
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
    background-color: #303030;
  }

  &.active {
    background-color: #333333;
    color: white;
  }
`;

const UserName = styled.span`
  color: white;
  font-size: 14px;
  margin-bottom: 5px;
`;

const SidebarItem = ({ Icon, Text, to }: { Icon: React.ElementType; Text: string; to: string }) => (
  <SidebarItemContainer to={to} activeClassName="active">
    <Icon />
    {Text}
  </SidebarItemContainer>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userName = storedUser?.username || '';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SidebarContainer>
      <Content>
        <SidebarItem Icon={FaHome} Text="Home" to="/" />
        <SidebarItem Icon={FaChartBar} Text="Statistics" to="/statistics" />
        <SidebarItem Icon={FaMusic} Text="Music" to="/music" />
        {storedUser && <SidebarItem Icon={FaChartBar} Text="My Stat" to={`/mystat/${storedUser?._id}`} />}
        {storedUser && <SidebarItem Icon={FaMusic} Text="My Music" to={`/mymusic/${storedUser?._id}`} />}
        {storedUser && <SidebarItem Icon={MdFiberNew} Text="Create Music" to={`/newmusic/${storedUser?._id}`} />}
      </Content>

      {storedUser ? (
        <UserContainer>
          <UserName>{userName}</UserName>
          <button onClick={handleLogout} style={{ padding: '5px 10px', fontSize: '14px', marginTop: '5px' }}>
            Logout
          </button>
        </UserContainer>
      ) : (
        <div style={{ padding: '10px' }}>
          <NavLink to="/login">
            <button style={{ color: 'black', padding: '5px 10px', fontSize: '14px' }}>Login</button>
          </NavLink>
        </div>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;