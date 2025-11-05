import React from 'react';

const EventList = ({ events = [], setEvents }) => { // Default to empty array

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.length === 0 ? (
          <li>No events found.</li>
        ) : (
          events.map(event => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EventList;
