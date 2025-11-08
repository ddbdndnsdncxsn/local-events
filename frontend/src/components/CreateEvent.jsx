// frontend/src/components/CreateEvent.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNotify } from '../context/NotificationContext';
import { useLocation, useNavigate } from 'react-router-dom';

const toLocalInputValue = (dateLike) => {
  if (!dateLike) return '';
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return '';
  const off = d.getTimezoneOffset();
  const adjusted = new Date(d.getTime() - off * 60000);
  return adjusted.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const CreateEvent = () => {
  const { success, error } = useNotify();
  const navigate = useNavigate();
  const location = useLocation();
  const eventToEdit = location.state?.eventToEdit || null;
  const isEdit = useMemo(() => Boolean(eventToEdit?._id), [eventToEdit]);

  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    dateTimeLocal: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setForm({
        title: eventToEdit.title || '',
        location: eventToEdit.location || '',
        description: eventToEdit.description || '',
        dateTimeLocal: toLocalInputValue(eventToEdit.dateTime),
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getApiError = (err, fallback = 'Something went wrong') =>
    err?.response?.data?.message || err?.message || fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.dateTimeLocal) {
      error('Please choose a date & time');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      // BACKEND REQUIRES `dateTime`
      dateTime: new Date(form.dateTimeLocal).toISOString(),
    };

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/events/${eventToEdit._id}`,
          payload,
          { headers }
        );
        success('Event updated ✅');
      } else {
        await axios.post('http://localhost:5000/api/events', payload, { headers });
        success('Event created successfully 🎉');
      }
      window.dispatchEvent(new Event('events-updated'));
      navigate('/');
    } catch (err) {
      error(getApiError(err, isEdit ? 'Failed to update event' : 'Failed to create event'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="dateTimeLocal"
          placeholder="Date & Time"
          value={form.dateTimeLocal}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Event')}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;