import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Persist username in localStorage; no cookies needed
    const [user, setUser] = useState(localStorage.getItem('user') || null);

    const register = async (username, password) => {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        // Do not auto-login on register; user will log in explicitly
    };

    const login = async (username, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        const usernameFromServer = response.data?.user?.username || username; // prefer server value
        localStorage.setItem('user', usernameFromServer);
        setUser(usernameFromServer);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);