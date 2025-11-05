import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import Cookies from 'js-cookie';

const App = () => {
  const [events, setEvents] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>LocalEvents</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RedirectBasedOnCookie />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const RedirectBasedOnCookie = () => {
  const { user } = useAuth();
  const userCookie = Cookies.get("user");

  if (user || userCookie) {
    return <AuthUserWrap />;
  } else {
    return <Navigate to="/login" />;
  }
};

const AuthUserWrap = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);

  return (
    <>
      <p>
        Welcome, {user}! <button onClick={logout}>Logout</button>
      </p>
      <EventForm setEvents={setEvents} />
      <EventList events={events} setEvents={setEvents} />
    </>
  );
};

export default App;
