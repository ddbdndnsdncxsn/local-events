// frontend/src/components/EventList.jsx
import React from 'react';

const EventList = ({ events, handleEdit, handleDelete }) => {
  return (
    <div>
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
                hour12: true
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

export default EventList;
