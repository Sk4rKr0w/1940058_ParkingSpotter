const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('driver', 'operator', 'admin'), allowNull: false, defaultValue: 'driver' },
    uniqueCode: { type: DataTypes.STRING, allowNull: true, unique: true }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
