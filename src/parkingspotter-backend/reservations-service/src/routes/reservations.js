const express = require('express');
const jwt = require('jsonwebtoken');
const { Reservation, Parking } = require('../models');
const { sendNotification } = require('../utils/notifications');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Create reservation
router.post('/', authenticate, async (req, res) => {
  try {
    const { parkingId, carPlate, startTime, endTime } = req.body;
    const reservation = await Reservation.create({
      userId: req.user.id,
      parkingId,
      carPlate,
      startTime,
      endTime
    });

    await sendNotification(req.user.id, `Your reservation for spot ${parkingId} is confirmed.`);
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

  await sendNotification(req.user.id, `Your reservation for spot ${reservation.parkingId} was cancelled.`);
  res.json({ message: 'Reservation cancelled', reservation });
});

// Get user reservations
router.get('/', authenticate, async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    include: [ { model: Parking } ]
  });
  res.json(reservations);
});

module.exports = router;