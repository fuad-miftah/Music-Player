import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { API_BASE_URL } from '../api/baseApi';

// Define a type for the User object
type UserType = {
  _id: string;
  username: string;
  // Add other properties based on your user object
};

const UserListContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
`;

const UserListItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 15px; /* Increased padding */
  margin-bottom: 10px;
  border-radius: 8px; /* Increased border-radius */
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-size: 1.2rem; /* Larger font size */
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]); // Use the defined type

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<{ data: UserType[] }>(`${API_BASE_URL}/users`);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <UserListContainer>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <UserListItem key={user._id}>
            {user.username}
            <DeleteButton onClick={() => handleDelete(user._id)}>Delete</DeleteButton>
          </UserListItem>
        ))}
      </ul>
    </UserListContainer>
  );
};

export default UserList;
