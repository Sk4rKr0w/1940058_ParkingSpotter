const cron = require("node-cron");
const { Reservation } = require("../models");

async function checkExpiredReservations() {
  try {
    const now = new Date();

    const [affectedCount] = await Reservation.update(
      { status: "expired" },
      {
        where: {
          endTime: { [require("sequelize").Op.lt]: now },
          status: { [require("sequelize").Op.ne]: "expired" },
        },
      }
    );

    if (affectedCount > 0) {
      console.log(`[ReservationsChecker] Expired ${affectedCount} reservations at ${now.toISOString()}`);
    }
  } catch (err) {
    console.error("[ReservationsChecker] Error while checking reservations:", err);
  }
}

function startReservationsChecker() {
  cron.schedule("*/30 * * * * *", () => {
    checkExpiredReservations();
  });

  console.log("[ReservationsChecker] Cron job started (every 30s)");
}

module.exports = { startReservationsChecker };
