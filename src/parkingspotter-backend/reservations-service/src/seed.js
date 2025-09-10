const { User, Parking } = require("./models");
const bcrypt = require("bcrypt");

types = ['uncovered', 'covered', 'underground', 'multi-storey'];

async function seed() {
  // Admin user
  let admin = await User.findOne({ where: { email: "admin@admin.it" } });

  if (!admin) {
    const hashed = await bcrypt.hash("test12345", 10);

    admin = await User.create({
      name: "Admin",
      surname: "Di Prova",
      email: "admin@admin.it",
      password: hashed,
      role: "admin"
    });

    console.log("Admin user created:", admin.email);
  } else {
    console.log("Admin user already exists:", admin.email);
  }

  // Operator user
  let operator = await User.findOne({ where: { email: "prova@prova.it" } });

  if (!operator) {
    const hashed = await bcrypt.hash("test12345", 10);

    operator = await User.create({
      name: "User",
      surname: "Di Prova",
      email: "prova@prova.it",
      password: hashed,
      role: "operator",
      uniqueCode:
        "209c536855acc31c37d56bbaead558a5638f70da682ead9984a7e6ed50f901c9a63bcc388e086ad77b0e5f7e5bb81b4f53024cfe662a7d50141d3dc9c2561319",
    });

    console.log("Operator user created:", operator.email);
  } else {
    console.log("Operator user already exists:", operator.email);
  }

  operator = await User.findOne({ where: { email: "prova@prova.it" } });

  const count = await Parking.count();
  if (count > 0) {
    console.log("Parkings already seeded.");
    return;
  }

  const rome = { name: "Rome", lat: 41.9028, lon: 12.4964 };

  const sampleParkings = [
    {
      id: 0,
      name: "Roma Centro Storico",
      latitude: rome.lat + 0.01,
      longitude: rome.lon - 0.01,
      totalSpots: 120,
      occupiedSpots: 0,
      hourlyPrice: 5,
      type: "underground",
      operatorId: operator.id,
    },
    {
      id: 1,
      name: "Roma Stazione Termini",
      latitude: rome.lat - 0.02,
      longitude: rome.lon + 0.02,
      totalSpots: 200,
      occupiedSpots: 0,
      hourlyPrice: 4,
      type: "multi-storey",
      operatorId: operator.id,
    },
    {
      id: 2,
      name: "Roma EUR",
      latitude: rome.lat - 0.05,
      longitude: rome.lon + 0.05,
      totalSpots: 150,
      occupiedSpots: 0,
      hourlyPrice: 3,
      type: "covered",
      operatorId: operator.id,
    },
  ];

  await Parking.bulkCreate(sampleParkings);
  console.log("Seeded 3 parking lots in Rome");
}

module.exports = { seed };
