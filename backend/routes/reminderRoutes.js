const express = require('express');
const router = express.Router();
const { getReminders, createReminder, toggleReminder, deleteReminder, markDone } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getReminders).post(createReminder);
router.patch('/:id/toggle', toggleReminder);
router.patch('/:id/done', markDone);
router.delete('/:id', deleteReminder);

module.exports = router;
