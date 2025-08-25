const express = require('express');
const jwt = require('jsonwebtoken');
const { Reservation, User } = require('../models');
const { sendNotification } = require('../utils/notifications');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Create reservation
router.post('/', authenticate, async (req, res) => {
  try {
    const { spotId, startTime, endTime } = req.body;
    const reservation = await Reservation.create({
      userId: req.user.id,
      spotId,
      startTime,
      endTime
    });

    await sendNotification(req.user.id, `Your reservation for spot ${spotId} is confirmed.`);
    res.json({ message: 'Reservation created', reservation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel reservation
router.post('/:id/cancel', authenticate, async (req, res) => {
  const reservation = await Reservation.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
  if (reservation.status == 'cancelled') return res.status(404).json({ error: 'Reservation already cancelled' });

  reservation.status = 'cancelled';
  await reservation.save();

  await sendNotification(req.user.id, `Your reservation for spot ${reservation.spotId} was cancelled.`);
  res.json({ message: 'Reservation cancelled', reservation });
});

// Get user reservations
router.get('/', authenticate, async (req, res) => {
  const reservations = await Reservation.findAll({ where: { userId: req.user.id } });
  res.json(reservations);
});

module.exports = router;