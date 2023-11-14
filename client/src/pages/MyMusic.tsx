
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UpdateModal from '../components/updateModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const MusicCard = styled.div`
  background-color: #000;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 230px;
  cursor: pointer;
  text-decoration: none;
  margin: 10px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ArtistName = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const EditButton = styled(FaEdit)`
  cursor: pointer;
`;

const DeleteButton = styled(FaTrash)`
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageNumber = styled.span<{ isActive: boolean }>`
  padding: 8px;
  margin: 0 5px;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? 'white' : 'black')};
  background-color: ${({ isActive }) => (isActive ? 'blue' : 'transparent')};
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? 'blue' : '#ddd')};
    color: white;
  }
`;

const MyMusic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [musicList, setMusicList] = useState([] as any[]);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(musicList.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentCards = musicList.slice(startIndex, endIndex);

  const handleDelete = async (musicId: string) => {
    const shouldDelete = window.confirm('Are you sure you want to delete?');

    if (shouldDelete) {
      try {
        await axios.delete(`http://localhost:5555/api/music/${id}/${musicId}`, { withCredentials: true });
        setMusicList((prevList) => prevList.filter((m) => m._id !== musicId));
      } catch (error) {
        console.error('Error deleting music:', error);
      }
    }
  };

  return (
    <Container>
      <h1>My Music</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentCards.map((music) => (
          <MusicCard key={music._id}>
            <CardImage src={music.coverImg.url} alt="Album Art" />
            <CardContent>
              <Title>{music.title}</Title>
              <ArtistName>{music.artist}</ArtistName>
              <ButtonContainer>
                <EditButton onClick={() => openUpdateModal(music._id)} />
                <DeleteButton onClick={() => handleDelete(music._id)} />
              </ButtonContainer>
            </CardContent>
          </MusicCard>
        ))}
      </div>
      <PaginationContainer>
        {Array.from({ length: totalPages }).map((_, index) => (
          <PageNumber
            key={index}
            isActive={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </PageNumber>
        ))}
      </PaginationContainer>
      <UpdateModal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal} musicId={selectedMusicId} />
    </Container>
  );
};

export default MyMusic;