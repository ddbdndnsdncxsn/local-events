import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Ensure useAuth is imported
import EventManager from './components/EventManager'; 
import Login from './components/Login';
import Register from './components/Register';
import CreateEvent from './components/CreateEvent';
import Navigation from './components/Navigation'; 

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <h1>LocalEvents</h1>
                    <Navigation />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/" element={<PrivateRoute component={EventManager} />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

// PrivateRoute Component for protecting routes
const PrivateRoute = ({ component: Component }) => {
    const { user } = useAuth(); // Get user state from AuthContext
    return user ? <Component /> : <Navigate to="/login" replace />;
};

export default App;
