require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models');
const reservationsRoutes = require('./routes/reservations');
const parkingsRoutes = require('./routes/parking');

const { seedParkings } = require("./seed");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/reservations', reservationsRoutes);
app.use('/parkings', parkingsRoutes);

const PORT = process.env.PORT || 4002;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Create tables if they don't exist
    await sequelize.sync({ alter: true });

    await seedParkings();

    app.listen(PORT, () => {
      console.log(`Reservations service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
