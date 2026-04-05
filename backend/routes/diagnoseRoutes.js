const express = require('express');
const router = express.Router();
const { runDiagnosis, getDiagnoses } = require('../controllers/diagnoseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getDiagnoses).post(runDiagnosis);

module.exports = router;
