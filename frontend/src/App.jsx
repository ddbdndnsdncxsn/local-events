import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  const [events, setEvents] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>LocalEvents</h1>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/">
              <AuthUserWrap setEvents={setEvents} events={events} />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthUserWrap = ({ setEvents, events }) => {
  const { user, logout } = useAuth();

  console.log("User:", user); // Debug log

  if (!user) {
    return (
      <div>
        <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link>.</p>
      </div>
    );
  }

  return (
    <>
      <p>
        Welcome, {user}! <button onClick={logout}>Logout</button>
      </p>
      <EventForm setEvents={setEvents} />
      <EventList events={events} setEvents={setEvents} />
    </>
  );
};

export default App;
