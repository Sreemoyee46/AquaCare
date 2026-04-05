const Tank = require('../models/Tank');
const Reminder = require('../models/Reminder');

const createTank = async (req, res) => {
  try {
    const { name, fishId, fishName, fishEmoji, size, waterType } = req.body;
    const tank = await Tank.create({ user: req.user._id, name, fishId, fishName, fishEmoji, size, waterType });

    // Auto-create default reminders
    const now = new Date();
    const reminders = [
      { user: req.user._id, tank: tank._id, title: 'Feed Fish', type: 'feed', frequency: 'Twice daily', nextDue: new Date(now.setHours(18,0,0,0)), icon: '🍽️' },
      { user: req.user._id, tank: tank._id, title: 'Water Change (25%)', type: 'water_change', frequency: 'Every 7 days', nextDue: new Date(Date.now() + 7*24*60*60*1000), icon: '💧' },
      { user: req.user._id, tank: tank._id, title: 'Filter Cleaning', type: 'filter_clean', frequency: 'Every 30 days', nextDue: new Date(Date.now() + 30*24*60*60*1000), icon: '🧹' },
      { user: req.user._id, tank: tank._id, title: 'Parameter Check', type: 'parameter_check', frequency: 'Every 3 days', nextDue: new Date(Date.now() + 3*24*60*60*1000), icon: '🔬' },
    ];
    await Reminder.insertMany(reminders);

    res.status(201).json(tank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTanks = async (req, res) => {
  try {
    const tanks = await Tank.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tanks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTank = async (req, res) => {
  try {
    const tank = await Tank.findOne({ _id: req.params.id, user: req.user._id });
    if (!tank) return res.status(404).json({ message: 'Tank not found' });
    res.json(tank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTank = async (req, res) => {
  try {
    await Tank.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Tank deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTank, getTanks, getTank, deleteTank };
