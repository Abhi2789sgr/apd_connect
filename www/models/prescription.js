"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Prescription = sequelize.define("Prescription",{
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    patient_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    therapy_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    total_vol: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    fill_vol: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    total_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    last_fill_vol: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tidal_vol: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    valid_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    valid_till: {
      type: DataTypes.DATE,
      allowNull: false
    },
    full_drain_every: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    prescription_image: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    tableName: "prescription",
    timestamps: false,
    underscored: false,
  });
  return Prescription;
};
