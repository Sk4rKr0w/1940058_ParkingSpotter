require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const reservationsRoutes = require('./routes/reservations');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/me', protectedRoutes);
app.use('/reservations', reservationsRoutes);

const PORT = process.env.PORT || 4001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    // Create tables if they don't exist
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
