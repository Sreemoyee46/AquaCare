const SHOP_ITEMS = require('../data/shopData');
const AQUARIUMS = require('../data/aquariumData');

const getShopItems = async (req, res) => {
  try {
    const { category } = req.query;
    let items = SHOP_ITEMS;
    if (category && category !== 'all') items = SHOP_ITEMS.filter(i => i.cat === category);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAquariums = async (req, res) => {
  try {
    res.json(AQUARIUMS);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getShopItems, getAquariums };
