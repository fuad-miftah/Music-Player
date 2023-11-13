// Import necessary dependencies
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart } from '../reducers/authSlice';
import { RootState } from '../reducers/rootReducer';

// Styling using Emotion
import styled from '@emotion/styled';

// Styled components
const LoginPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
`;

const LoginForm = styled.form`
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const LoginPage: React.FC = () => {
  // Use state to manage form input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Use navigate from React Router
  const navigate = useNavigate();

  // Use dispatch from Redux
  const dispatch = useDispatch();

  // Select error from the Redux state
  const error = useSelector((state: RootState) => state.auth.error);

  // Function to handle form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch login action
    dispatch(loginStart({ username, password }));

    // For demonstration purposes, navigate to home page if there's no error
    if (!error) {
      navigate('/');
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm onSubmit={handleLogin}>
        

        <FormLabel htmlFor="username">Username:</FormLabel>
        <FormInput
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FormLabel htmlFor="password">Password:</FormLabel>
        <FormInput
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormButton type="submit">Login</FormButton>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
