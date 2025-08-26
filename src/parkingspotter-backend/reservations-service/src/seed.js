const { Parking } = require("./models");

async function seedParkings() {
  const count = await Parking.count();
  if (count > 0) {
    console.log("Parkings already seeded.");
    return;
  }

  const sampleParkings = [];

  const cities = [
    { name: "Rome", lat: 41.9028, lon: 12.4964 },
    { name: "Milano", lat: 45.4642, lon: 9.19 },
    { name: "Napoli", lat: 40.8522, lon: 14.2681 },
    { name: "Torino", lat: 45.0703, lon: 7.6869 },
    { name: "Palermo", lat: 38.1157, lon: 13.3615 },
    { name: "Firenze", lat: 43.7696, lon: 11.2558 },
    { name: "Bologna", lat: 44.4949, lon: 11.3426 },
    { name: "Venezia", lat: 45.4408, lon: 12.3155 },
    { name: "Genova", lat: 44.4056, lon: 8.9463 },
    { name: "Bari", lat: 41.1171, lon: 16.8719 },
  ];

  for (let i = 0; i < 50; i++) {
    const city = cities[i % cities.length];

    // small random offsets (~0.05°) so all parkings aren’t on the exact same point
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lonOffset = (Math.random() - 0.5) * 0.1;

    sampleParkings.push({
      name: `${city.name} Parcheggio ${i + 1}`,
      latitude: city.lat + latOffset,
      longitude: city.lon + lonOffset,
      totalSpots: Math.floor(Math.random() * 200) + 50,
      occupiedSpots: 0,
    });
  }

  await Parking.bulkCreate(sampleParkings);
  console.log("Seeded 50 parking lots in Italy");
}

module.exports = { seedParkings };