// frontend/src/components/EventManager.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect to login if token is not available
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/events', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Error fetching events');
            }
        };

        fetchEvents();
    }, [navigate]);

    const requestDelete = (id) => {
        setPendingDeleteId(id);
    };

    const handleSuccess = (message) => {
        toast.success(message, { autoClose: 3000 });
    };

    const handleError = (message) => {
        toast.error(message, { autoClose: 3000 });
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/events/${pendingDeleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents((prev) => prev.filter((event) => event._id !== pendingDeleteId));
            handleSuccess('Event successfully deleted.'); // Success notification
        } catch (err) {
            console.error('Error deleting event:', err);
            handleError('Failed to delete event. Please try again.'); // Error notification
        } finally {
            setPendingDeleteId(null);
        }
    };

    const cancelDelete = () => setPendingDeleteId(null);
    const pendingTitle = events.find((e) => e._id === pendingDeleteId)?.title;

    return (
        <div>
            <h2>Your Events</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {events.length === 0 ? (
                    <li>No events found.</li>
                ) : (
                    events.map((event) => (
                        <li key={event._id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p>{new Date(event.dateTime).toLocaleString()}</p>
                            <button onClick={() => requestDelete(event._id)}>Delete</button>
                            <button onClick={() => navigate('/create-event', { state: { eventToEdit: event } })}>                            Edit
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <ConfirmDialog
                open={!!pendingDeleteId}
                title="Delete this event?"
                message={`Are you sure you want to delete "${pendingTitle || 'this event'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <ToastContainer /> {/* Add ToastContainer for notifications */}
        </div>
    );
};

export default EventManager;

