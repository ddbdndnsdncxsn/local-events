import React from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';

const App = () => {
  return (
    <div>
      <h1>LocalEvents</h1>
      <EventForm />
      <EventList />
    </div>
  );
};

export default App;
