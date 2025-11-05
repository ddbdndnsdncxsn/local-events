// frontend/src/components/EventForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ setEvents }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Unauthorized');
      return;
    }

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
      } catch (error) {
        setError('Error updating event');
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/events', 
          { title, description, dateTime: eventDateTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents([...events, response.data]);
        setError('');
      } catch (error) {
        setError('Error creating event');
        console.error(error);
      }
    }

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setEditingEventId(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingEventId ? 'Edit Event' : 'Create Event'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
  );
};

export default EventForm;