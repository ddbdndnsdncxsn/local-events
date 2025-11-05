// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(Cookies.get("user") || null);

    const login = async (username, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        Cookies.set("user", username); // Set cookie on successful login
        setUser(username);
    };

    const logout = () => {
        localStorage.removeItem('token');
        Cookies.remove("user"); // Remove cookie on logout
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
