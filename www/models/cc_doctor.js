"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const CCDoctor = sequelize.define("CCDoctor",{
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    cc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    doctor_id: {
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
    tableName: "cc_doctor",
    underscored: false,
    timestamps:false
  });

  return CCDoctor;
};
