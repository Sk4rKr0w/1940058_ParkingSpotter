const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  // return basic profile info
  res.json({ user: req.user });
});

// example of role-restricted endpoint
router.get('/admin-only', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome admin!' });
});

module.exports = router;
