import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EventManager from './components/EventManager';
import Login from './components/Login';
import Register from './components/Register';
import CreateEvent from './components/CreateEvent';
import Navigation from './components/Navigation';
import NotFound from './components/NotFound';
import ReminderCenter from './components/ReminderCenter';

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
    const { user } = useAuth();

    return (
        <>
            {location.pathname !== '/login' && location.pathname !== '/register' && <Navigation />}
            {user && <ReminderCenter />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-event" element={<PrivateRoute component={CreateEvent} />} />
                <Route path="/" element={<PrivateRoute component={EventManager} />} />
                <Route path="*" element={<NotFound />} />
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