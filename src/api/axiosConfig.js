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
        // 1. Check for 401/403, and also 500 (Spring Boot's default for expired JWTs)
        const isUnauthorized = error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500);
        
        // 2. Check if CORS blocked the error response (common with expired tokens)
        const isCorsOrNetworkError = !error.response && error.message === 'Network Error';

        if (isUnauthorized || isCorsOrNetworkError) {
            const originalRequestUrl = error.config?.url || '';
            
            if (!originalRequestUrl.includes('/auth/login') && !originalRequestUrl.includes('/auth/change-password')) {
                console.warn("Session expired or unauthorized. Triggering logout...");
                
                // Clear storage immediately to prevent infinite redirect loops
                localStorage.removeItem('jwt');
                localStorage.removeItem('userId');
                
                // Dispatch event for React to update the AuthContext state
                window.dispatchEvent(new Event('auth:unauthorized'));
                
                // Force a hard redirect to the login page to ensure the user doesn't stay on the Menu
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;