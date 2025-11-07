import React from 'react';
import axios from 'axios';
import EventList from './EventList';

const UserEvents = ({ events, setEvents }) => {
  const handleEdit = (event) => {
    // Logic to set the form values for editing
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== id)); // Remove deleted event from state
      window.dispatchEvent(new Event('events-updated')); // keep reminders in sync
    } catch (error) {
      console.error('Error deleting event:', error.response || error);
    }
  };

  return (
    <div>
      <h2>Your Events</h2>
      <EventList events={events} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default UserEvents;