const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Parking = sequelize.define("Parking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    totalSpots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    occupiedSpots: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Parking;
};
