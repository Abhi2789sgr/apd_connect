"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const PatientDoctor = sequelize.define("PatientDoctor",{
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    created_at: {
      type:DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull:false
    },
    updated_at: {
      type:DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull:false
    }
  },
  {
    tableName: "doctor_patient",
    underscored: false,
    timestamps:false
  });

  return PatientDoctor;
};
