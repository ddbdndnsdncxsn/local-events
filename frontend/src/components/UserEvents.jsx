import React, { useState } from 'react';
import axios from 'axios';
import EventList from './EventList';
import ConfirmDialog from './ConfirmDialog';

const UserEvents = ({ events, setEvents }) => {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleEdit = (event) => {
    // Logic to set the form values for editing
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${pendingDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== pendingDeleteId));
      window.dispatchEvent(new Event('events-updated')); // keep reminders in sync
    } catch (error) {
      console.error('Error deleting event:', error.response || error);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => setPendingDeleteId(null);

  const pendingTitle = events.find((e) => e._id === pendingDeleteId)?.title;

  return (
    <div>
      <h2>Your Events</h2>
      <EventList
        events={events}
        handleEdit={handleEdit}
        handleDelete={requestDelete}
      />

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete this event?"
        message={`Are you sure you want to delete "${pendingTitle || 'this event'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserEvents;