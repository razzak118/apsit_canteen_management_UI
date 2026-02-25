import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('jwt');
        const userId = localStorage.getItem('userId');
        return token && userId ? { userId } : null;
    });

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('userId', response.data.userId);
        setUser({ username, userId: response.data.userId }); 
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        setUser(null);
    };

    // Listen for the custom unauthorized event from Axios
    useEffect(() => {
        const handleUnauthorized = () => {
            logout(); // This clears state and local storage immediately
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        // Cleanup the listener when the component unmounts
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};