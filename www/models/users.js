'use strict';
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    first_name:{
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name:{
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email:{
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password:{
      type: DataTypes.STRING(128),
      allowNull: true
    },
    mobile_no:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
    status:{
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    user_type:{
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
  },{
    tableName: 'user',
    timestamps: false,
    underscored: false
  });
  return User;
}
