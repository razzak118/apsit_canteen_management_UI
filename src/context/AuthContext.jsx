import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage so sessions persist across page reloads
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

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};