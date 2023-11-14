// UpdateModal.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

interface UpdateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  musicId: string | null;
}

interface MusicData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  imageFile: File | null;
  audioFile: File | null;
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;

  h2 {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1em;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.loading ? 'not-allowed' : 'pointer')};
  font-size: 1.2em;
  display: flex;
  align-items: center;
`;

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onRequestClose, musicId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatedMusicData, setUpdatedMusicData] = useState<Partial<MusicData>>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    imageFile: null,
    audioFile: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (musicId) {
      const fetchMusicData = async () => {
        try {
          const response = await axios.get(`http://localhost:5555/api/music/${id}/${musicId}`, { withCredentials: true });
          const musicData = response.data.data;
          setUpdatedMusicData({
            title: musicData.title,
            artist: musicData.artist,
            album: musicData.album,
            genre: musicData.genre,
          });
        } catch (error) {
          console.error('Error fetching music data for update:', error);
        }
      };

      fetchMusicData();
    }
  }, [id, musicId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (musicId) {
        const formData = new FormData();
        formData.append('title', updatedMusicData.title || '');
        formData.append('artist', updatedMusicData.artist || '');
        formData.append('album', updatedMusicData.album || '');
        formData.append('genre', updatedMusicData.genre || '');
        formData.append('coverImage', updatedMusicData.imageFile || '');
        formData.append('audioFile', updatedMusicData.audioFile || '');

        await axios.put(
          `http://localhost:5555/api/music/${id}/${musicId}`,
          formData,
          { withCredentials: true }
        );
        onRequestClose(); // Close the modal after a successful update
        navigate(`/my-music/${id}`); // Navigate to the MyMusic page
      }
    } catch (error) {
      console.error('Error updating music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedMusicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files ? files[0] : null;

    setUpdatedMusicData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Music Modal"
      ariaHideApp={false}
    >
      <ModalContainer>
        <h2>Update Music</h2>
        <Label>
          Title:
          <Input
            type="text"
            name="title"
            value={updatedMusicData.title}
            onChange={handleChange}
          />
        </Label>
        <Label>
          Artist:
          <Input
            type="text"
            name="artist"
            value={updatedMusicData.artist}
            onChange={handleChange}
          />
        </Label>
        <Label>
          Album:
          <Input
            type="text"
            name="album"
            value={updatedMusicData.album}
            onChange={handleChange}
          />
        </Label>
        <Label>
          Genre:
          <Input
            type="text"
            name="genre"
            value={updatedMusicData.genre}
            onChange={handleChange}
          />
        </Label>
        <Label>
          Cover Image:
          <Input
            type="file"
            name="imageFile"
            onChange={handleFileChange}
          />
        </Label>
        <Label>
          Audio File:
          <Input
            type="file"
            name="audioFile"
            onChange={handleFileChange}
          />
        </Label>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Music'}
        </Button>
      </ModalContainer>
    </Modal>
  );
};

export default UpdateModal;
