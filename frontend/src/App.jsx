import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthUserWrap from './components/AuthUserWrap';
import Login from './components/Login';
import Register from './components/Register';
import Cookies from 'js-cookie'; // Import Cookies

const App = () => {
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
  const userCookie = Cookies.get("user"); // Use the imported Cookies

  if (user || userCookie) {
    return <AuthUserWrap />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default App;
