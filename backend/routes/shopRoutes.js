const express = require('express');
const router = express.Router();
const { getShopItems, getAquariums } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/items', getShopItems);
router.get('/aquariums', getAquariums);

module.exports = router;
