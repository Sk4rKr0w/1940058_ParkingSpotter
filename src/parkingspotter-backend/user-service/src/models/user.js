const { DataTypes } = require('sequelize');
const { encryptUniqueCode, decryptUniqueCode } = require('../utils/uniqueCode')

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
    uniqueCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
      set(value) {
        // Encrypt before saving
        const encrypted = encryptUniqueCode(value);
        this.setDataValue("uniqueCode", encrypted);
      },
      get() {
        // Decrypt on retrieval
        const encrypted = this.getDataValue("uniqueCode");
        return decryptUniqueCode(encrypted);
      }}
  }, {
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
