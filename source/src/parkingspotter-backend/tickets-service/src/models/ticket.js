const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Ticket = sequelize.define(
        "Ticket",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            }
        },
        {
            tableName: "Tickets",
            timestamps: true
        }
    );

    return Ticket;
};