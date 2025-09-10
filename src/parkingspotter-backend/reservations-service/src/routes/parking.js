const express = require("express");
const { Parking, Reservation, User } = require("../models");
const { getDistanceFromLatLonInKm } = require("../utils/parking");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Add a new parking
router.post("/", authenticate, authorize(["operator"]), async (req, res) => {
  try {
    const { name, latitude, longitude, totalSpots, hourlyPrice, type, city, address } = req.body;

    if (!name || !latitude || !longitude || !totalSpots || !city || !address) {
      return res.status(400).json({ error: "name, latitude, longitude, city, address and totalSpots are required" });
    }

    const parking = await Parking.create({
      name,
      latitude,
      longitude,
      city,
      address,
      totalSpots,
      occupiedSpots: 0,
      hourlyPrice: hourlyPrice || 0,
      type: type || "uncovered",
      operatorId: req.user.id
    });

    res.status(201).json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// View all parkings for the logged-in operator
router.get("/list", authenticate, authorize(["operator"]), async (req, res) => {
  try {
    const parkings = await Parking.findAll({ where: { operatorId: req.user.id } });
    res.json(parkings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get latest n parkings being admin
router.get("/list/admin", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const parkings = await Parking.findAll({
      order: [["createdAt", "DESC"]],
      limit,
    });

    res.json(parkings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search parkings by operator email being admin
router.get("/list/admin/search", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parkings = await Parking.findAll({ where: { operatorId: user.id } });

    res.json({
      operator: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
      parkings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Edit parking only if owned by operator or being an admin
router.post("/:id", authenticate, authorize(["operator", "admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, totalSpots, hourlyPrice, type } = req.body;

    const parking = await Parking.findByPk(id);
    if (!parking) return res.status(404).json({ error: "Parking not found" });
    if (parking.operatorId !== req.user.id && req.user.role != "admin") {
      return res.status(403).json({ error: "You are not the owner of this parking" });
    }

    await parking.update({ name, latitude, longitude, totalSpots, hourlyPrice, type });
    res.json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// View parking statistics if owned by operator or being an admin
router.get("/:id/stats", authenticate, authorize(["operator", "admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const parking = await Parking.findByPk(id, { include: [Reservation] });

    if (!parking) return res.status(404).json({ error: "Parking not found" });
    if (parking.operatorId !== req.user.id && req.user.role != "admin") {
      return res.status(403).json({ error: "You are not the owner of this parking" });
    }

    const totalReservations = parking.Reservations.length;
    const activeReservations = parking.Reservations.filter(r => r.status === "active").length;

    const stats = {
      id: parking.id,
      name: parking.name,
      totalSpots: parking.totalSpots,
      occupiedSpots: parking.occupiedSpots,
      availableSpots: parking.totalSpots - parking.occupiedSpots,
      totalReservations,
      activeReservations,
      utilizationRate: (parking.occupiedSpots / parking.totalSpots) * 100
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get nearby parkings
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon, radius = 2 } = req.query; // radius in km
    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const parkings = await Parking.findAll();

    // filter by distance
    const nearby = parkings.filter((p) => {
      const distance = getDistanceFromLatLonInKm(
        parseFloat(lat),
        parseFloat(lon),
        p.latitude,
        p.longitude
      );
      return distance <= radius;
    });

    res.json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;