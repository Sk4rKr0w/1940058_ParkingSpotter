const axios = require("axios");

async function notifyReservation(reservation) {
  try {
    const response = await axios.post(`http://ingestion-service:3000/reservation`, {
      reservationId: reservation.id,
      parkingId: reservation.parkingId,
      type: reservation.type
    });

    console.log("Reservation event sent:", response.data);
  } catch (err) {
    console.error("Failed to notify ingestion service:", err.message);
  }
}

module.exports = { notifyReservation };