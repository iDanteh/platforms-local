import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://backplatforms-production.up.railway.app/api/v1',
});

export default axiosInstance;