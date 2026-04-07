const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { tank, caretakerId, caretakerName, startDate, endDate, totalCost } = req.body;
    
    if (!tank || !caretakerId || !startDate || !endDate || !totalCost) {
      return res.status(400).json({ message: 'Missing required fields for booking' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      tank,
      caretakerId,
      caretakerName,
      startDate,
      endDate,
      totalCost
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tank', 'name emoji size')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getUserBookings };
