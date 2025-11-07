import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const pad2 = (n) => String(n).padStart(2, '0');
const toLocalDateStr = (dt) => `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
const toLocalTimeStr = (dt) => `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;

const CreateEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const eventToEdit = location.state?.eventToEdit || null;

    const dt = eventToEdit ? new Date(eventToEdit.dateTime) : null;

    const [title, setTitle] = useState(eventToEdit ? eventToEdit.title : '');
    const [description, setDescription] = useState(eventToEdit ? eventToEdit.description : '');
    const [date, setDate] = useState(eventToEdit ? toLocalDateStr(dt) : '');
    const [time, setTime] = useState(eventToEdit ? toLocalTimeStr(dt) : '');
    const [reminder, setReminder] = useState(eventToEdit ? eventToEdit.reminder : '1 hour before');
    const [error, setError] = useState('');

    const buildEventDateTime = (dateStr, timeStr) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        const [hh, mm] = timeStr.split(':').map(Number);
        return new Date(y, m - 1, d, hh, mm, 0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !date || !time) {
            setError('All fields are required');
            return;
        }

        const token = localStorage.getItem('token');
        const eventDateTime = buildEventDateTime(date, time);

        if (isNaN(eventDateTime.getTime())) {
            setError('Invalid date or time');
            return;
        }

        setError('');

        try {
            if (eventToEdit) {
                // Edit existing event
                await axios.put(
                    `http://localhost:5000/api/events/${eventToEdit._id}`,
                    { title, description, dateTime: eventDateTime, reminder },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Clear "seen" flag for this event so it can remind again at the new time
                const seen = JSON.parse(localStorage.getItem('remindersShown') || '{}');
                delete seen[eventToEdit._id];
                localStorage.setItem('remindersShown', JSON.stringify(seen));

                // Notify ReminderCenter to refresh its schedule
                window.dispatchEvent(new Event('events-updated'));
                navigate('/');
            } else {
                // Create new event
                await axios.post(
                    'http://localhost:5000/api/events',
                    { title, description, dateTime: eventDateTime, reminder },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Notify ReminderCenter to refresh its schedule
                window.dispatchEvent(new Event('events-updated'));
                navigate('/');
            }

            // Reset form after submission
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setReminder('1 hour before');
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
                <div>
                    <label>Reminder:</label>
                    <select
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        required
                    >
                        <option value="1 hour before">1 hour before</option>
                        <option value="1 day before">1 day before</option>
                        <option value="1 week before">1 week before</option>
                    </select>
                </div>
                <button type="submit">{eventToEdit ? 'Update Event' : 'Create Event'}</button>
            </form>
        </div>
    );
};

export default CreateEvent;