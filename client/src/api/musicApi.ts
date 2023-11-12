// api/musicApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555/api'; // Replace with your actual API base URL

export const fetchMusicData = () => axios.get(`${API_BASE_URL}/music/allwithstat`);
