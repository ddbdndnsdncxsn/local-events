const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateTime: { type: Date, required: true }, // Ensure this is correctly defined
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


module.exports = mongoose.model('Event', eventSchema);
