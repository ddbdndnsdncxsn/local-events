// frontend/src/components/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventToEdit = location.state?.eventToEdit || null; // Get the event to edit

  const [title, setTitle] = useState(eventToEdit ? eventToEdit.title : '');
  const [description, setDescription] = useState(eventToEdit ? eventToEdit.description : '');
  const [date, setDate] = useState(eventToEdit ? new Date(eventToEdit.dateTime).toISOString().split('T')[0] : '');
  const [time, setTime] = useState(eventToEdit ? new Date(eventToEdit.dateTime).toTimeString().slice(0, 5) : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !time) {
      setError('All fields are required');
      return;
    }

    const token = localStorage.getItem('token');
    const eventDateTime = new Date(`${date}T${time}`);

    if (isNaN(eventDateTime.getTime())) {
      setError('Invalid date or time');
      return;
    }

    setError('');

    try {
      if (eventToEdit) {
        // Edit existing event
        const response = await axios.put(`http://localhost:5000/api/events/${eventToEdit._id}`, 
          { title, description, dateTime: eventDateTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Navigate back to EventManager after editing
        navigate('/');
      } else {
        // Create new event
        const response = await axios.post('http://localhost:5000/api/events', 
          { title, description, dateTime: eventDateTime },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Navigate back to EventManager after creation
        navigate('/');
      }

      // Reset form fields after submission
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event. Please try again.');
    }
  };

  return (
    <div>
      <h2>{eventToEdit ? 'Edit Event' : 'Create Event'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Time:</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">{eventToEdit ? 'Update Event' : 'Create Event'}</button>
      </form>
    </div>
  );
};

export default CreateEvent;
