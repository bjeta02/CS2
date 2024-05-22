const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const connectDB = require('./db');
const Distance = require('./models/distanceModel');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

// Routes
app.get('/api/distances', async (req, res) => {
  try {
    const distances = await Distance.find().sort({ timestamp: -1 });
    res.json(distances);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/distances', async (req, res) => {
  const { distance, alertStatus } = req.body;

  try {
    const newDistance = new Distance({
      distance,
      alertStatus,
    });

    const savedDistance = await newDistance.save();
    res.json(savedDistance);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
