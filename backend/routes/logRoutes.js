const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getLogs).post(createLog);

module.exports = router;
