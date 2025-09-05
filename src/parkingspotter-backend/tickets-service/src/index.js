require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./models');
const ticketRoutes = require('./routes/ticket');

const app = express();
app.use(bodyParser.json());

app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 4003;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Create tables if they don't exist
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Assistance tickets service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
