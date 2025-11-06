// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigating

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password); // Call login function from context
            navigate('/'); // Redirect to home page after successful login
        } catch (err) {
            setError('Invalid credentials'); // Show error if login fails
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            <p>
                Don't have an account? 
                <Link to="/register" style={{ marginLeft: '5px' }}>
                    Register
                </Link>
            </p>
        </form>
    );
};

export default Login;
