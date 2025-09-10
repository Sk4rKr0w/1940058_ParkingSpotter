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

  const sampleParkings = [
    {
      id: 1,
      name: "Roma Centro Storico",
      latitude: 41.90927529111484,
      longitude: 12.492593061936542,
      city: 'Rome',
      address: 'Via Abruzzi 11',
      totalSpots: 30,
      occupiedSpots: 0,
      hourlyPrice: 5,
      type: "underground",
      operatorId: operator.id,
    },
    {
      id: 2,
      name: "Roma Stazione Termini",
      latitude: 41.89855921052377,
      longitude: 12.5018964426665,
      city: 'Rome',
      address: 'Via Filippo Turati 52',
      totalSpots: 200,
      occupiedSpots: 0,
      hourlyPrice: 4,
      type: "multi-storey",
      operatorId: operator.id,
    },
    {
      id: 3,
      name: "Roma EUR",
      latitude: 41.829846312259924,
      longitude: 12.47472614873045,
      city: 'Rome',
      address: "Via dell'Architettura",
      totalSpots: 150,
      occupiedSpots: 0,
      hourlyPrice: 3,
      type: "covered",
      operatorId: operator.id,
    },
  ];

  await Parking.bulkCreate(sampleParkings);

  await Parking.query(
    `SELECT setval('"Parkings_id_seq"', (SELECT MAX(id) FROM "Parkings"))`
  );

  console.log("Seeded 3 parking lots in Rome");
}

module.exports = { seed };
