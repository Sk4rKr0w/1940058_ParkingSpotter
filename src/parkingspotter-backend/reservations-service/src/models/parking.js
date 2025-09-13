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
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    totalSpots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    occupiedSpots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hourlyPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.ENUM('uncovered', 'covered', 'underground', 'multi-storey'),
      defaultValue: 'uncovered'
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return Parking;
};
