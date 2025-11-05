// frontend/src/components/UserEvents.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
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
        setError('Failed to fetch events');
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Combine date and time into ISO format
    const eventDateTime = new Date(`${date}T${time}`);
    
    if (isNaN(eventDateTime)) {
      setError('Invalid date or time');
      return;
    }

    if (editingEventId) {
      try {
        await axios.put(`http://localhost:5000/api/events/${editingEventId}`, 
          { title, description, dateTime: eventDateTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(events.map(event => 
          event._id === editingEventId 
            ? { ...event, title, description, dateTime: eventDateTime } 
            : event
        ));
        setError('');
      } catch (err) {
        setError('Error updating event');
        console.error(err);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/events', 
          { title, description, dateTime: eventDateTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents([...events, response.data]);
        setError('');
      } catch (err) {
        setError('Error creating event');
        console.error(err);
      }
    }

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setEditingEventId(null);
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    
    // Parse existing dateTime for date/time inputs
    const eventDate = new Date(event.dateTime);
    setDate(eventDate.toISOString().split('T')[0]);
    setTime(eventDate.toTimeString().slice(0, 5));
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      setError('Error deleting event');
      console.error(err);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h3>{editingEventId ? 'Edit Event' : 'Create Event'}</h3>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          />
        <button type="submit">{editingEventId ? 'Update Event' : 'Create Event'}</button>
      </form>
          <h2>User Events</h2>

      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              {new Date(event.dateTime).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <button onClick={() => handleEdit(event)}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserEvents;