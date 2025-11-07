const express = require('express');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to extract userId from the token
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Get all events for a specific user
router.get('/', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const events = await Event.find({ userId }).sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const { title, description, dateTime, reminder } = req.body;
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const newEvent = new Event({
      title,
      description,
      dateTime,
      reminder: reminder || '1 hour before',
      userId
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;