import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Matches your Spring Boot context path
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;