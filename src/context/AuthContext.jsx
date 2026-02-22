import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        // Your backend returns { jwt, userId }
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