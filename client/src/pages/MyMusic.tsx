import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UpdateModal from '../components/updateModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { deleteMusicStart } from '../reducers/musicSlice';

interface Music {
  _id: string;
  coverImg: {
    public_id: string;
    url: string;
  };
  audio: {
    public_id: string;
    url: string;
  };
  title: string;
  artist: string;
  album: string;
  genre: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Header = styled.h1`
font-size: 2.5rem;
color: white;
align-self: start;
padding-left: 20px;
`;

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const MusicCard = styled.div`
  background-color: #05386B;
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
  color: #EDF5E1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const EditButton = styled(FaEdit)`
  cursor: pointer;
  color: #5CDB95;
`;

const DeleteButton = styled(FaTrash)`
  cursor: pointer;
  color: #5CDB95;
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
  color: ${({ isActive }) => (isActive ? '#EDF5E1' : 'white')};
  background-color: ${({ isActive }) => (isActive ? '#05386B' : 'transparent')};
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#8EE4AF' : '#379683')};
    color: white;
  }
`;

const Error = styled.div`
  color: #05386B; 
  padding: 30px;
  margin: 20px 0; 
  font-size: 20em;
`;

const MyMusic: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [musicList, setMusicList] = useState([] as Music[]);
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
    axios.get(`http://localhost:5555/api/music/user/${id}`, { withCredentials: true })
    .then(response => {
      setMusicList(response.data.data);
    })
    .catch(error => {
      console.error('Error fetching updated music data:', error);
    });
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

        if(id){
        await new Promise<void>((resolve) => {
          dispatch(deleteMusicStart({ id, musicId }));
          resolve();
        });
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const response = await axios.get(`http://localhost:5555/api/music/user/${id}`, {
          withCredentials: true
        });
    
        setMusicList(response.data.data);

      }
      } catch (error) {
        console.error('Error deleting music:', error);
      }
    }
  };

  if(musicList.length === 0){
    return <Error>No Music</Error>;
  }
  return (
    <Container>
      <Header>My Music</Header>
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