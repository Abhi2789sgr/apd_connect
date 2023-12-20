"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const UserDevice = sequelize.define("UserDevice",{
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    device_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_id: {
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
    tableName: "user_devices",
    underscored: false,
  });

  return UserDevice;
};
