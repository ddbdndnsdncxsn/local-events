// frontend/src/components/AuthUserWrap.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import UserEvents from './UserEvents';
import ReminderNotification from './ReminderNotification';

const AuthUserWrap = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = Cookies.get("user");

        if (!userCookie && !user) {
            navigate('/login');
        } else if (user) {
            checkForReminders();
            navigate('/');
        }
    }, [user, navigate]);

    const checkForReminders = () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('reminder-'));
        const now = Date.now();

        keys.forEach(key => {
            const reminderDetails = JSON.parse(localStorage.getItem(key));
            const reminderTime = new Date(reminderDetails.dateTime).getTime();

            if (reminderTime <= now) {
                // Show notification for the reminder
                showNotification(reminderDetails.title);
                localStorage.removeItem(key); // Clean up after showing notification
            }
        });
    };

    const showNotification = (title) => {
        alert(`${title} is starting soon!`); // Consider replacing with a more sophisticated UI
    };

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
        </>
    );
};

export default AuthUserWrap;
