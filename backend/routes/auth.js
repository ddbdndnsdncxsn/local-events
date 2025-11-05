const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Use environment variable in production

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create a new user
    const newUser = new User({ username, password });
    
    // Save the new user to the database
    await newUser.save();
    console.log('User registered successfully:', username);
    
    // Respond with success message
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create a JWT token for authenticated users
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Respond with the token
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: error.message });
  }
});

// Export the router
module.exports = router;
