import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
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
                    <MainRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
};

// MainRoutes component to manage routes and conditional navigation
const MainRoutes = () => {
    const location = useLocation();

    return (
        <>
            {/* Conditionally render the Navigation component */}
            {location.pathname !== '/login' && location.pathname !== '/register' && <Navigation />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/" element={<PrivateRoute component={EventManager} />} />
            </Routes>
        </>
    );
};

// PrivateRoute Component for protecting routes
const PrivateRoute = ({ component: Component }) => {
    const { user } = useAuth(); // Get user state from AuthContext
    return user ? <Component /> : <Navigate to="/login" replace />;
};

export default App;
