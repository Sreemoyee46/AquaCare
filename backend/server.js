const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

app.get('/', (req, res) => res.json({ message: 'AquaCare API running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(process.env.PORT || 5000, () =>
        console.log(`Server running on port ${process.env.PORT || 5000}`)
      );
    }
  })
  .catch(err => console.error('MongoDB error:', err));

// Export the Express API for Vercel
module.exports = app;
