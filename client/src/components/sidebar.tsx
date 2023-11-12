import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaEnvelope, FaRegSun, FaUserAlt, FaIdCardAlt, FaRegFileAlt, FaRegCalendarAlt, FaChartBar, FaMusic } from 'react-icons/fa';
import styled from '@emotion/styled';

const SidebarContainer = styled.div`
  background-color: black;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 200px;
`;

const Content = styled.div`
  margin-top: 60px;
`;

const SidebarItemContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  background-color: #1A202C;
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

  text-decoration: none; /* Remove underline */
  color: white; /* Default link color */

  &:hover {
    background-color: #2C3846;
  }

  &.active {
    background-color: #1E1E1E; /* Change the active link background color */
    color: white; /* Change the active link text color */
  }
`;

const SidebarItem = ({ Icon, Text, to }: { Icon: React.ElementType; Text: string; to: string }) => (
  <SidebarItemContainer to={to} activeClassName="active">
    <Icon />
    {Text}
  </SidebarItemContainer>
);

const Sidebar = () => (
  <SidebarContainer>
    <Content>
      <SidebarItem Icon={FaHome} Text="Home" to="/" />
      <SidebarItem Icon={FaChartBar} Text="Statistics" to="/statistics" />
      <SidebarItem Icon={FaUserAlt} Text="Users" to="/users" />
      <SidebarItem Icon={FaMusic} Text="Music" to="/music" />
      <SidebarItem Icon={FaRegCalendarAlt} Text="Calendar" to="/calendar" />
      <SidebarItem Icon={FaIdCardAlt} Text="Employees" to="/employees" />
      <SidebarItem Icon={FaRegFileAlt} Text="Reports" to="/reports" />
      <SidebarItem Icon={FaRegSun} Text="Settings" to="/settings" />
    </Content>
    
    {/* Login Section */}
    <div style={{ position: 'absolute', bottom: 20, left: 10 }}>
      <img
        src="https://res.cloudinary.com/dvzhoifgr/image/upload/v1699652474/images/ueluum4lwtk7txqw9cew.png" // Replace with the path to the user's avatar image
        alt="User Avatar"
        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
      />
      <span style={{ color: 'white', fontSize: '14px' }}>John Doe</span> {/* Replace with the user's name */}
    </div>
  </SidebarContainer>
);

export default Sidebar;
