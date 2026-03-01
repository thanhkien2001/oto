import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Direct to Laravel API for dev if proxy fails or just consistent
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add interceptor for token authentication if stored in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
