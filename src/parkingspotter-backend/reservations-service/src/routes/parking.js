const express = require("express");
const { Parking } = require("../models");
const { getDistanceFromLatLonInKm } = require("../utils/parking");

const router = express.Router();

// Add a new parking
router.post("/", async (req, res) => {
  try {
    const { name, latitude, longitude, totalSpots } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({ error: "name, latitude and longitude are required" });
    }

    const parking = await Parking.create({
      name,
      latitude,
      longitude,
      totalSpots: totalSpots || 0,
      occupiedSpots: 0
    });

    res.status(201).json(parking);
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