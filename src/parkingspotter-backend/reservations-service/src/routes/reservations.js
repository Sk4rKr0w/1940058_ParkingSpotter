const express = require('express');
const jwt = require('jsonwebtoken');
const { Reservation, Parking } = require('../models');
const { sendNotification } = require('../utils/notifications');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const { Op } = require("sequelize");
const { notifyReservation } = require('../utils/reservationsToSensors');

function roundToTwoDecimalPlaces(num) {
    return Math.round(num * 100) / 100;
}

// Create reservation
router.post('/', authenticate, async (req, res) => {
  try {
    const { parkingId, carPlate, startTime, endTime } = req.body;

    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    const durationHours = (end - start) / (1000 * 60 * 60); // ms to hours
    const price = roundToTwoDecimalPlaces(durationHours * parking.hourlyPrice);

    const reservation = await Reservation.create({
      userId: req.user.id,
      parkingId,
      carPlate,
      startTime,
      endTime,
      price
    });

    await sendNotification(req.user.id, `Your reservation for spot ${parkingId} is confirmed.`);
    notifyReservation({
      id: reservation.id,
      parkingId: parkingId,
      type: "created"
    });
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
  notifyReservation({
    id: reservation.id,
    parkingId: reservation.parkingId,
    type: "cancelled"
  });
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

// Get active reservations for a parking
router.get('/active/:parkingId', async (req, res) => {
  const { parkingId } = req.params;
  const now = new Date();

  try {
    const reservations = await Reservation.findAll({
      where: {
        parkingId,
        status: 'active',
        startTime: { [Op.lte]: now },
        endTime: { [Op.gte]: now }
      }
    });

    res.json({
      parkingId,
      reservedSpots: reservations.length,
      reservations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Get today's reservation count
router.get("/stats/today", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Reservation.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    res.json({ date: startOfDay.toISOString().split("T")[0], reservations: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;