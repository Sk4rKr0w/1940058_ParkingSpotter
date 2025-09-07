const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Reservation } = require('../models');

const { generateUniqueCode } = require('../utils/uniqueCode')
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Signup
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'name, surname, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, surname, email, password: hashed, role: role || 'driver', uniqueCode: (role == 'operator' || role == 'admin' ? generateUniqueCode() : null)});

    return res.status(201).json({ id: user.id, email: user.email, name: user.name, surname: user.surname, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { userId: user.id, role: user.role, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Edit user info
router.post('/user', authenticate, async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if they are provided
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get total user count
router.get("/stats", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const totalCount = await User.count();

    res.json({ totalUsers: totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get latest n users
router.get("/list", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const users = await User.findAll({
      attributes: ["id", "name", "surname", "createdAt", "role", "email"],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const date = new Date(user.createdAt);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const reservationsCount = await Reservation.count({
          where: { userId: user.id }
        });

        return {
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          registrationDate: `${day}/${month}/${year}`,
          reservationsCount: reservationsCount
        };
      })
    );

    res.json(formattedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
