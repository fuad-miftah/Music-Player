import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { API_BASE_URL } from '../api/baseApi';
import { useParams } from 'react-router-dom';


type UserType = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  img?: string;
  address?: string;
  phone?: string;
};

const UserDetailsContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
`;

const UserInfoItem = styled.div`
  margin-bottom: 15px; /* Increase margin for better spacing */
`;

const Label = styled.strong`
  font-size: 1.2rem; /* Larger font size for labels */
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem; /* Larger font size for input */
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
  box-sizing: border-box;
`;

const UpdateButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px; /* Increase padding for a larger button */
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem; /* Larger font size for the button text */
`;

const allUserFields: Array<keyof UserType> = [
  'firstName',
  'lastName',
  'username',
  'email',
  'img',
  'address',
  'phone',
];

const UserDetail: React.FC = () => {
    const [updatedUser, setUpdatedUser] = useState<UserType>({ _id: '', firstName: '', lastName: '', username: '', email: '', img: '', address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ data: UserType }>(`${API_BASE_URL}/users/${id}`);
        setUpdatedUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put<{ data: UserType }>(`${API_BASE_URL}/users/${id}`, updatedUser);
      setUpdatedUser(response.data.data);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDetailsContainer>
      <h2>User Details</h2>
      {allUserFields.map((key) => (
        <UserInfoItem key={key}>
          <Label>{key}:</Label>{' '}
          <Input
            type="text"
            name={key}
            value={updatedUser[key] || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, [key]: e.target.value })}
          />
        </UserInfoItem>
      ))}
      <UpdateButton onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </UpdateButton>
    </UserDetailsContainer>
  );
};

export default UserDetail;
