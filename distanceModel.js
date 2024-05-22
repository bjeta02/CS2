const mongoose = require('mongoose');

const DistanceSchema = new mongoose.Schema({
  distance: {
    type: Number,
    required: true,
  },
  alertStatus: {
    type: String, // You can adjust the data type based on your specific alert statuses (e.g., 'alert', 'no_alert')
    default: 'no_alert', // Assuming 'no_alert' is the default status when no alert is triggered
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Distance', DistanceSchema);
