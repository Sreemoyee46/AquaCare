const express = require('express');
const router = express.Router();
const { createTank, getTanks, getTank, deleteTank, updateTank } = require('../controllers/tankController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getTanks).post(createTank);
router.route('/:id').get(getTank).delete(deleteTank).patch(updateTank);

module.exports = router;
