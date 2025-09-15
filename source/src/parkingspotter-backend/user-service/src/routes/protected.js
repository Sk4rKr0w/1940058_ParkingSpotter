const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const { User } = require('../models');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  // return basic profile info
  res.json({ user: req.user });
});

// Get user uniqueCode
router.get('/uniqueCode', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['uniqueCode']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ uniqueCode: user.uniqueCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
