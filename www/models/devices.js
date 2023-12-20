"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Device = sequelize.define("Device",{
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    device_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
  },
  {
    tableName: "device",
    timestamps: false,
    underscored: false,
  });
  return Device;
};
