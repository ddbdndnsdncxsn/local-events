import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserEvents = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError('Failed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (editingEventId) {
      // Edit existing event
      try {
        await axios.put(`http://localhost:5000/api/events/${editingEventId}`, { title, description, date }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(events.map(event => (event._id === editingEventId ? { ...event, title, description, date } : event)));
      } catch (err) {
        setError('Error updating event');
        console.error(err);
      }
    } else {
      // Create new event
      try {
        const response = await axios.post('http://localhost:5000/api/events', { title, description, date }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents([...events, response.data]);
      } catch (err) {
        setError('Error creating event');
        console.error(err);
      }
    }

    // Reset form fields
    setTitle('');
    setDescription('');
    setDate('');
    setEditingEventId(null);
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      setError('Error deleting event');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>User Events</h2>
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
        <button type="submit">{editingEventId ? 'Update Event' : 'Create Event'}</button>
      </form>

      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <button onClick={() => handleEdit(event)}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserEvents;
