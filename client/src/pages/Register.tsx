import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styled from '@emotion/styled';

const RegistrationPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const RegistrationForm = styled.form`
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
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const RegistrationPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Make API call to register user
            const response = await axios.post('http://localhost:5555/api/auth/register', {
                username,
                password,
                email,
            });

            // Check if registration was successful
            if (response.data.success) {
                // Navigate to the login page
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('Registration failed. Please try again.');
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

                <FormButton type="submit">Register</FormButton>

                {error && <ErrorMessage>{error}</ErrorMessage>}
            </RegistrationForm>
        </RegistrationPageContainer>
    );
};

export default RegistrationPage;
