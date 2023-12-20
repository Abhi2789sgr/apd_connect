"use strict";

const { async } = require("q");

const Device = require("./../../utils/sequelizeConn").Device;
const User = require("./../../utils/sequelizeConn").User;
const UserDevice = require("./../../utils/sequelizeConn").UserDevice;

User.belongsToMany(Device, { through: UserDevice });
Device.belongsToMany(User, { through: UserDevice });

exports.getUserDevices = async function (userID) {
  // Assuming you have the user object or the user ID
  const user = await User.findByPk(userID);

  if (user) {
    // Get all devices associated with the user
    const devices = await user.getDevices();

    const userDevices = devices.map((device) => device.toJSON());

    console.log(userDevices);
    return userDevices;
  } else {
    return false;
  }
};

exports.addUserDevices = async function (userID, DeviceData, info, addDevice) {
  console.log("info : ", info);
  try {
    let device = null;
    if (addDevice) {
      device = await Device.create(DeviceData);
    } else {
      device = await Device.findByPk(DeviceData.id);
    }
    const user = await User.findByPk(userID);
    // Check if the association already exists
    const associationExists = await user.hasDevice(device);

    if (!associationExists) {
      console.log("has asso : ", associationExists);
      // Associating the device with the user
      const result = await user.addDevice(device, {
        through: {
          role: user.role,
          assigned_by: info.assigned_by,
          start_date: info.start_date,
          end_date: info.end_date,
        },
      });
      console.log("result of association : ", result);
    }
  } catch (error) {
    console.log(error);
  }

  return DeviceData;
};

exports.findDeviceByNumber = async function (deviceNumber) {
  return await Device.findOne({
    where: { device_number: deviceNumber },
  }).then(function (deviceData) {
    return deviceData;
  });
};

exports.deleteDevice = async function (deviceNumber) {
  return await Device.destroy({
    where: {
      device_number: deviceNumber,
    },
  }).then(
    function (rowDeleted) {
      if (rowDeleted === 1) {
        return true;
      }
    },
    function (err) {
      return false;
    }
  );
};

//remove patient device association if exists
//role is 6 for patient
exports.removePatientDeviceRelation = async function (patientId) {
  return await UserDevice.destroy({
    where: { UserId: patientId, role: "6" },
  }).then(function (rowDeleted) {
    if (rowDeleted === 1) return true;
  },function (err) {
    return false;
  });
};
