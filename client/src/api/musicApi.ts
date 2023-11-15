import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
});

export default axiosInstance;

//const API_BASE_URL = 'http://localhost:5555/api';


