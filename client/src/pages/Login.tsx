import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart } from '../reducers/authSlice';

import styled from '@emotion/styled';
import { RootState } from '../reducers/rootReducer';

const LoginPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0;

`;

const LoginForm = styled.form`
  width: 400px;
  padding: 20px;
  border: 1px solid #379683;
  border-radius: 8px;
  box-shadow: 0 0 10px #8EE4AF;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.5em; /* Larger font size */
  color: #05386B; /* White label text */
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px; /* Larger padding */
  margin-bottom: 16px;
  font-size: 1.2em; /* Larger font size */
  border: 1px solid #05386B;
  border-radius: 4px;
  box-sizing: border-box;
`;

const FormButton = styled.button<{ loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background-color: ${(props) => (props.loading ? '#666' : '#05386B')}; /* Change color when loading */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.loading ? 'not-allowed' : 'pointer')};
  font-size: 1.2em;

  /* Add a transition effect for a smoother color change */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.loading ? '#666' : '#035075')}; /* Change hover color when loading */
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const RegisterLink = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 1.2em; /* Larger font size */
  color: #fff; /* White text */
`;

const RegisterHere = styled.span`
  color: #05386B;
  `;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Use useEffect to handle navigation based on the authentication status
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await dispatch(loginStart({ username, password }));
      console.log("check end");
      
      // Check authentication status in the Redux store
      if (isAuthenticated) {
        navigate('/');
      } else {
        // Handle authentication failure (show error message, etc.)
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Error occurred. Please try again.'); // Handle other errors
    } finally {
      setLoading(false);
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

        <FormButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </FormButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RegisterLink>
          Don't have an account? <Link to="/register"><RegisterHere>Register here</RegisterHere></Link>
        </RegisterLink>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
