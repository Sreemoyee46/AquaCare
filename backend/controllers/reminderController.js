const Reminder = require('../models/Reminder');

const getReminders = async (req, res) => {
  try {
    const { tankId } = req.query;
    const query = { user: req.user._id };
    if (tankId) query.tank = tankId;
    const reminders = await Reminder.find(query).sort({ nextDue: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const { tankId, title, type, frequency, nextDue, icon } = req.body;
    const reminder = await Reminder.create({
      user: req.user._id, tank: tankId,
      title, type, frequency, nextDue, icon
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    reminder.enabled = !reminder.enabled;
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markDone = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    const now = new Date();
    let daysToAdd = 1;
    switch (reminder.frequency) {
      case 'Daily': daysToAdd = 1; break;
      case 'Every 2 days': daysToAdd = 2; break;
      case 'Weekly': daysToAdd = 7; break;
      case 'Every 2 weeks': daysToAdd = 14; break;
      case 'Monthly': daysToAdd = 30; break;
    }
    
    now.setDate(now.getDate() + daysToAdd);
    reminder.nextDue = now;
    
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReminders, createReminder, toggleReminder, deleteReminder, markDone };
