import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== id));
      window.dispatchEvent(new Event('events-updated')); // Unschedule any pending reminder
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    }
  };

  return (
    <div>
      <h2>Your Events</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {events.length === 0 ? (
          <li>No events found.</li>
        ) : (
          events.map(event => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{new Date(event.dateTime).toLocaleString()}</p>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
              <button onClick={() => navigate('/create-event', { state: { eventToEdit: event } })}>
                Edit
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EventManager;