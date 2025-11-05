import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import EventList from './EventList';
import UserEvents from './UserEvents';

const AuthUserWrap = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = Cookies.get("user");

        if (!userCookie && !user) {
            navigate('/login');
        } else if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div>
                <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link>.</p>
            </div>
        );
    }

    return (
        <>
            <p>
                Welcome, {user}! <button onClick={logout}>Logout</button>
            </p>
                        <UserEvents />
            <EventList />
        </>
    );
};

export default AuthUserWrap;
