const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    spotId: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'cancelled', 'completed'), defaultValue: 'active' },
    parkingId: {
      type: DataTypes.INTEGER,
      allowNull: false,  // each reservation must belong to a parking
    }
  });

  return Reservation;
};