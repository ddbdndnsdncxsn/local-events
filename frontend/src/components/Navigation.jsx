// frontend/src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Home</Link>&nbsp;|&nbsp;
            <Link to="/create-event">Create Event</Link>
            {user ? (
                <>
                    &nbsp;|&nbsp;
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    &nbsp;|&nbsp;
                    <Link to="/login">Login</Link>
                    &nbsp;|&nbsp;
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navigation;
