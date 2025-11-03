import React, { useState } from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';

const App = () => {
  const [events, setEvents] = useState([]);

  return (
    <div>
      <h1>LocalEvents</h1>
      <EventForm setEvents={setEvents} />
      <EventList events={events} setEvents={setEvents} />
    </div>
  );
};

export default App;
