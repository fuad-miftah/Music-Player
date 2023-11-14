// MyMusic.tsx

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UpdateModal from '../components/updateModal'; // UpdateModal file path

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const MusicCard = styled.div`
  background-color: #333;
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 60%;
  margin: 20px;
`;

const MusicImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

interface MusicData {
  _id: string;
  coverImg: {
    url: string;
  };
  title: string;
  artist: string;
  // Add other properties as needed
}

const MyMusic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [musicList, setMusicList] = useState<MusicData[]>([]);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/music/user/${id}`, { withCredentials: true });
        setMusicList(response.data.data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };

    fetchData();
  }, [id]);

  const openUpdateModal = (musicId: string) => {
    setUpdateModalIsOpen(true);
    setSelectedMusicId(musicId);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedMusicId(null);
  };

  return (
    <Container>
      <h1>My Music</h1>
      {musicList.map((music) => (
        <MusicCard key={music._id}>
          <MusicImage src={music.coverImg.url} alt={music.title} />
          <h2>{music.title}</h2>
          <p>Artist: {music.artist}</p>
          <ButtonContainer>
            <button onClick={() => openUpdateModal(music._id)}>Update</button>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5555/api/music/${id}/${music._id}`, { withCredentials: true });
                  setMusicList((prevList) => prevList.filter((m) => m._id !== music._id));
                } catch (error) {
                  console.error('Error deleting music:', error);
                }
              }}
            >
              Delete
            </button>
          </ButtonContainer>
        </MusicCard>
      ))}
      <UpdateModal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal} musicId={selectedMusicId} />
    </Container>
  );
};

export default MyMusic;

