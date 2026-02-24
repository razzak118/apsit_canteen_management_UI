import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Matches your Spring Boot context path
});

// Request Interceptor: Automatically attach the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Catch expired/invalid JWTs globally
api.interceptors.response.use(
    (response) => {
        // If the request is successful, just return the response
        return response;
    },
    (error) => {
        // If there's an error, check if it's an authentication error (401 or 403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            
            // Check the URL of the request that failed
            const originalRequestUrl = error.config.url || '';
            
            // Bypass the hard redirect if the request was specifically for login or changing the password
            if (!originalRequestUrl.includes('/auth/login') && !originalRequestUrl.includes('/auth/change-password')) {
                console.warn("Session expired or unauthorized. Redirecting to login...");
                
                // Clear the invalid credentials from local storage
                localStorage.removeItem('jwt');
                localStorage.removeItem('userId');
                
                // Redirect the user to the login page
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;