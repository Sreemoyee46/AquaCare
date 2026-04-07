const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tanks', require('./routes/tankRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/diagnose', require('./routes/diagnoseRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/fish', require('./routes/fishRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Send all other requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB connected');
      if (process.env.NODE_ENV !== 'production') {
        const port = process.env.PORT || 5000;
        app.listen(port, () =>
          console.log(`Server running at http://localhost:${port}`)
        );
      }
    })
    .catch(err => console.error('MongoDB error:', err));
} else {
  console.error('CRITICAL: MONGO_URI is not defined. The API will not work properly!');
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`Server running on port ${port} (without DB)`)
    );
  }
}

// Export the Express API for Vercel
module.exports = app;
