const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const ReservationModel = require('./reservation');

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
const Reservation = ReservationModel(sequelize);

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Reservation
};
