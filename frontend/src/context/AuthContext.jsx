import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') || null);

    const register = async (username, password) => {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
    };

    const login = async (username, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        const usernameFromServer = response.data?.user?.username || username;
        localStorage.setItem('user', usernameFromServer);
        setUser(usernameFromServer);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Function to check token expiration
    const isTokenExpired = () => {
        const token = localStorage.getItem('token');
        if (!token) return true;

        const [, payload] = token.split('.');
        const decodedPayload = atob(payload);
        const { exp } = JSON.parse(decodedPayload);
        
        return Date.now() >= exp * 1000; // Check if current time exceeds expiration
    };

    useEffect(() => {
        if (isTokenExpired()) {
            logout(); // Automatically log out if token is expired
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Axios Interceptor for handling 401 responses (Unauthorized)
axios.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        // Check if token is expired and log out
        const { exp } = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload(); // Refresh the page or redirect to login
        }
    }
    return Promise.reject(error);
});
