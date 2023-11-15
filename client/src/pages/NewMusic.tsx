import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { createMusicStart } from '../reducers/musicSlice';
import { RootState } from '../reducers/rootReducer';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: transparent; /* Removed background color */
`;

const StyledLabel = styled.label`
  color: white;
  margin-bottom: 8px;
  font-size: 1.2em;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 8px; /* Rounded the input field */
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
  background-color: #444; /* Set a background color */
  border: 1px solid #666; /* Add a border */
  color: white; /* Text color */
`;

const StyledButton = styled.button<{ loading?: boolean }>`
  background-color: #61dafb;
  color: black;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.loading ? 'not-allowed' : 'pointer')};
  font-size: 1.2em;
  display: flex;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4CAF50;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 1em;
  margin-top: 8px;
`;

const NewMusic = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.music.loading);
  const error = useSelector((state: RootState) => state.music.error);
  const { id: userId } = useParams();

  const [musicData, setMusicData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    imageFile: null,
    audioFile: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMusicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files![0];

    setMusicData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loading) {
      try {
        if (userId) {
          dispatch(createMusicStart({ musicData, userId }));
          clearForm();
        } else {
          console.error('User ID is undefined.');
        }
      } catch (error) {
        console.error('Error creating music:', error);
      }
    }
  };

  const clearForm = () => {
    setMusicData({
      title: '',
      artist: '',
      album: '',
      genre: '',
      imageFile: null,
      audioFile: null,
    });
  };

  return (
    <StyledForm onSubmit={handleSubmit} encType="multipart/form-data">
      <StyledLabel>
        Title
        <StyledInput
          type="text"
          name="title"
          value={musicData.title}
          onChange={handleChange}
          placeholder="Enter title"
        />
      </StyledLabel>
      <StyledLabel>
        Artist
        <StyledInput
          type="text"
          name="artist"
          value={musicData.artist}
          onChange={handleChange}
          placeholder="Enter artist"
        />
      </StyledLabel>
      <StyledLabel>
        Album
        <StyledInput
          type="text"
          name="album"
          value={musicData.album}
          onChange={handleChange}
          placeholder="Enter album"
        />
      </StyledLabel>
      <StyledLabel>
        Genre
        <StyledInput
          type="text"
          name="genre"
          value={musicData.genre}
          onChange={handleChange}
          placeholder="Enter genre"
        />
      </StyledLabel>
      <StyledLabel>
        Cover Image
        <StyledInput
          type="file"
          name="imageFile"
          onChange={handleFileChange}
          placeholder="Choose cover image"
        />
      </StyledLabel>
      <StyledLabel>
        Audio File
        <StyledInput
          type="file"
          name="audioFile"
          onChange={handleFileChange}
          placeholder="Choose audio file"
        />
      </StyledLabel>
      
      {error && <ErrorMessage>Error Try again</ErrorMessage>}
      
      <StyledButton type="submit" loading={loading}>
        {loading && <Spinner />}
        {!loading && 'Create Music'}
      </StyledButton>
    </StyledForm>
  );
};

export default NewMusic;
