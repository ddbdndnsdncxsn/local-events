import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EventList from './EventList'; // Assuming EventList is the component that lists events

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events');
        console.error('Error fetching events:', err);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <EventList events={events} setEvents={setEvents} />
    </div>
  );
};

export default EventsPage;
