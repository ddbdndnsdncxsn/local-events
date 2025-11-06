import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const navigate = useNavigate(); // Get navigate here
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout(); // Call the logout function
        navigate('/login'); // Redirect to /login
    };

    return (
        <nav>
            <Link to="/">Home</Link>&nbsp;|&nbsp;
            <Link to="/create-event">Create Event</Link>
            {user ? (
                <>
                    &nbsp;|&nbsp;
                    <button onClick={handleLogout}>Logout</button>
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
