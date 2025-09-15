const cron = require("node-cron");
const { Reservation } = require("../models");
const { Op } = require("sequelize");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function handleExpiredReservation(reservation, channel) {
  console.log(`Handling expired reservation ${reservation.id}`);

  const message = {
    reservationId: reservation.id,
    parkingId: reservation.parkingId,
    type: "expired",
    timestamp: Date.now()
  };

  channel.publish(
    "reservation_exchange",
    "",
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log("Sent expired reservation event:", message);
}

// Process reservations slowly (1 per 1/2 second)
async function handleReservationsSlowly(reservations, channel) {
  for (const reservation of reservations) {
    handleExpiredReservation(reservation, channel);
    await sleep(500);
  }
}

async function checkExpiredReservations(channel) {
  try {
    const now = new Date();

    // Update reservations and get updated rows
    const [affectedCount, updatedReservations] = await Reservation.update(
      { status: "expired" },
      {
        where: {
          endTime: { [Op.lt]: now },
          status: {
            [Op.notIn]: ["expired", "cancelled"]
          }
        },
        returning: true
      }
    );

    if (affectedCount > 0) {
      console.log(`[ReservationsChecker] Expired ${affectedCount} reservations at ${now.toISOString()}`);
      handleReservationsSlowly(updatedReservations, channel);
    }
  } catch (err) {
    console.error("[ReservationsChecker] Error while checking reservations:", err);
  }
}

function startReservationsChecker(channel) {
  cron.schedule("*/30 * * * * *", () => {
    checkExpiredReservations(channel);
  });

  console.log("[ReservationsChecker] Cron job started (every 30s)");
}

module.exports = { startReservationsChecker };