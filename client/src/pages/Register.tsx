import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import styled from '@emotion/styled';

const RegistrationPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e1e;
`;

const RegistrationForm = styled.form`
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #1e1e1e;
  color: #fff;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.5em;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 16px;
  font-size: 1.2em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.loading ? 'not-allowed' : 'pointer')};
  font-size: 1.2em;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const LoginLink = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 1.2em;
  color: #fff;
`;

const RegistrationPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:5555/api/auth/register', {
        username,
        password,
        email,
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationPageContainer>
      <RegistrationForm onSubmit={handleRegistration}>
        <FormLabel htmlFor="username">Username:</FormLabel>
        <FormInput
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FormLabel htmlFor="email">Email:</FormLabel>
        <FormInput
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormLabel htmlFor="password">Password:</FormLabel>
        <FormInput
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
        <FormInput
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <FormButton type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </FormButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginLink>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginLink>
      </RegistrationForm>
    </RegistrationPageContainer>
  );
};

export default RegistrationPage;
