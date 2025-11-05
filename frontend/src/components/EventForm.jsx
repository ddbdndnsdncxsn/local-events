import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ setEvents }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Unauthorized'); // Handle unauthorized access
      return;
    }

    if (editingEventId) {
      // Edit existing event
      try {
        await axios.put(`http://localhost:5000/api/events/${editingEventId}`, { title, description, date }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(prevEvents => prevEvents.map(event => 
          event._id === editingEventId ? { ...event, title, description, date } : event
        ));
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      // Create new event
      try {
        const response = await axios.post('http://localhost:5000/api/events', { title, description, date }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(prevEvents => [...prevEvents, response.data]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setEditingEventId(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingEventId ? 'Edit Event' : 'Create Event'}</h2>
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
  );
};

export default EventForm;
