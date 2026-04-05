const express = require('express');
const router = express.Router();
const { createTank, getTanks, getTank, deleteTank } = require('../controllers/tankController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getTanks).post(createTank);
router.route('/:id').get(getTank).delete(deleteTank);

module.exports = router;
