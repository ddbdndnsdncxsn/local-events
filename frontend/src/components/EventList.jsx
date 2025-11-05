import React from 'react';

const EventList = ({ events = [], setEvents }) => {
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
              <p>
                {/* Format date and time to show both */}
                {new Date(event.dateTime).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true, // Change to false for 24-hour format
                })}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EventList;
