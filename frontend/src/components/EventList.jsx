// frontend/src/components/EventList.jsx
import React from 'react';

const EventList = ({ events, handleEdit, handleDelete }) => {
  return (
    <div>
      <h2>User Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              {/* Format the date and time */}
              {new Date(event.dateTime).toLocaleString('en-US', {
                weekday: 'long',    // Day of the week (e.g., Monday)
                year: 'numeric',     // Full year (e.g., 2025)
                month: 'long',       // Full month name (e.g., November)
                day: 'numeric',      // Day of the month (e.g., 10)
                hour: '2-digit',     // Two-digit hour (01-12)
                minute: '2-digit',   // Two-digit minute (00-59)
                hour12: true,        // 12-hour format
              })}
            </p>
            {event.location && <p><strong>Location:</strong> {event.location}</p>} {/* Show the location */}
            <button onClick={() => handleEdit(event)}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
