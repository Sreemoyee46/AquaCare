const express = require('express');
const router = express.Router();
const FISH_DB = require('../data/fishData');

router.get('/', (req, res) => res.json(FISH_DB));
router.get('/:id', (req, res) => {
  const fish = FISH_DB.find(f => f.id === req.params.id);
  if (!fish) return res.status(404).json({ message: 'Fish not found' });
  res.json(fish);
});

module.exports = router;
