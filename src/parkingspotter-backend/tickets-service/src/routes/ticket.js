const express = require("express");
const { Ticket } = require("../models");
const { authenticate, authorize } = require("../middleware/auth");
const { Op } = require("sequelize");

const router = express.Router();

// Submit ticket
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const ticket = await Ticket.create({ name, email, message });
    res.status(201).json({ success: true, ticketId: ticket.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get latest n tickets
router.get("/", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const tickets = await Ticket.findAll({
      order: [["createdAt", "DESC"]],
      limit,
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get total and today tickets count
router.get("/stats", async (req, res) => {
  try {
    const totalCount = await Ticket.count();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCount = await Ticket.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    res.json({ totalTickets: totalCount, todayTickets: todayCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
