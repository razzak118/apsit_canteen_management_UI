import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const originalRequestUrl = error.config.url || '';
            
            if (!originalRequestUrl.includes('/auth/login') && !originalRequestUrl.includes('/auth/change-password')) {
                console.warn("Session expired or unauthorized. Triggering logout...");
                
                // Dispatch a custom event instead of hard-redirecting
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default api;