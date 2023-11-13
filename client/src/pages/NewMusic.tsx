import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #333;
`;

const StyledLabel = styled.label`
  color: white;
  margin-bottom: 8px;
  font-size: 1.2em;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2em;
`;

const NewMusic = () => {
  const { id } = useParams();
  const [musicData, setMusicData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    imageFile: null,
    audioFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMusicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setMusicData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', musicData.title);
      formData.append('artist', musicData.artist);
      formData.append('album', musicData.album);
      formData.append('genre', musicData.genre);
      formData.append('imageFile', musicData.imageFile);
      formData.append('audioFile', musicData.audioFile);

      await axios.post(`http://localhost:5555/api/music/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Music created successfully!');
    } catch (error) {
      console.error('Error creating music:', error.message);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit} encType="multipart/form-data">
      <StyledLabel>
        Title:
        <StyledInput
          type="text"
          name="title"
          value={musicData.title}
          onChange={handleChange}
          placeholder="Enter title"
        />
      </StyledLabel>
      <StyledLabel>
        Artist:
        <StyledInput
          type="text"
          name="artist"
          value={musicData.artist}
          onChange={handleChange}
          placeholder="Enter artist"
        />
      </StyledLabel>
      <StyledLabel>
        Album:
        <StyledInput
          type="text"
          name="album"
          value={musicData.album}
          onChange={handleChange}
          placeholder="Enter album"
        />
      </StyledLabel>
      <StyledLabel>
        Genre:
        <StyledInput
          type="text"
          name="genre"
          value={musicData.genre}
          onChange={handleChange}
          placeholder="Enter genre"
        />
      </StyledLabel>
      <StyledLabel>
        Cover Image:
        <StyledInput
          type="file"
          name="imageFile"
          onChange={handleFileChange}
          placeholder="Choose cover image"
        />
      </StyledLabel>
      <StyledLabel>
        Audio File:
        <StyledInput
          type="file"
          name="audioFile"
          onChange={handleFileChange}
          placeholder="Choose audio file"
        />
      </StyledLabel>
      <StyledButton type="submit">Create Music</StyledButton>
    </StyledForm>
  );
};

export default NewMusic;
