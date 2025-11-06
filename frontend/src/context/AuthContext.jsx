import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(Cookies.get("user") || null);

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            Cookies.set("user", username);
            setUser(username);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            Cookies.set("user", username);
            setUser(username);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        Cookies.remove("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
