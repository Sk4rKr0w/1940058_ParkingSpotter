const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const TicketModel = require('./ticket');

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASS,
} = process.env;

const sequelize = new Sequelize(
  `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
  {
    logging: false,
  }
);

const User = UserModel(sequelize);
const Ticket = TicketModel(sequelize);

module.exports = {
  sequelize,
  User,
  Ticket
};
