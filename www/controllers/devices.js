"use strict";

const env = (process.env.NODE_ENV = process.env.NODE_ENV || "dev");
let config = require("../../" + env + "_config");
const devices = require(config.root +
  "/www/middlewares/DevicesMiddleWare/devices");
const devicesModel = require("./../utils/sequelizeConn").Device;
const user = require("./../utils/sequelizeConn").User;

exports.getUserDevices = function (req, res) {
  var user = req.user;
  if (user.id) {
    devices.getUserDevices(user.id).then(function (data) {
      res.status(200).send({ status: 1, msg: "Data Found", data: data });
    });
  } else {
    res.status(200).send({ status: 2, msg: "Data not found", data: null });
  }
};

exports.registerdevice = function (req, res) {
  var user = req.user;
  var deviceNumber = req.body.devicenumber;
  console.log("current logged in user id: ", user.id);
  console.log("current logged in user role: ", user.role);
  console.log("body user : ", req.body.id); //id of patient to whom machine is assigned
  let info = {
    assigned_by: user.id,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  }
  if (user.id && deviceNumber) {
    devicesMiddleWare
      .findDeviceByNumber(deviceNumber)
      .then(function (deviceData) {
        let id = req.body.id ? req.body.id : user.id;
        if (deviceData != null && deviceData.dataValues != undefined) {
          devicesMiddleWare
            .addUserDevices(id, deviceData.dataValues, info, false)
            .then(function (dataProvided) {
              res
                .status(200)
                .send({
                  status: 1,
                  msg: "Found Device and assign to new user",
                  data: dataProvided,
                });
            });
        } else {
          var deviceDataPost = {
            device_number: deviceNumber,
            nickname: deviceNumber,
            created_by: user.id,
            status: 1,
            configured: 0,
          };

          devicesMiddleWare
            .addUserDevices(user.id, deviceDataPost, info, true)
            .then(function (dataProvided) {
              res
                .status(200)
                .send({
                  status: 1,
                  msg: "Devices created",
                  data: dataProvided,
                });
            });
        }
      });
  } else {
    res.status(200).send({ status: 2, msg: "Not authorized", data: null });
  }
};

exports.checkDevice = function (req, res) {
  var deviceNumber = req.body.device_number;
  devicesMiddleWare
    .findDeviceByNumber(deviceNumber)
    .then(function (deviceData) {
      if (deviceData != null && deviceData.dataValues != undefined) {
        res.status(200).send({ status: 1, msg: "Device registered" });
      } else {
        res.status(200).send({ status: 0, msg: "Device unregistered" });
      }
    });
};

exports.deleteDevice = function (req, res) {
  var deviceNumber = req.body.device_number;
  if (deviceNumber != undefined && deviceNumber != "") {
    devicesMiddleWare.deleteDevice(deviceNumber).then(function (deleteData) {
      if (deleteData) {
        res.status(200).send({ status: 1, msg: "Device deleted successfully" });
      } else {
        res.status(200).send({ status: 0, msg: "Device does not exists" });
      }
    });
  }
};

exports.removePatientDeviceRelation = function (req, res) {
  let patientId = req.body.patientId;
  if (patientId != undefined && patientId != "") {
    devicesMiddleWare.removePatientDeviceRelation(patientId).then(function (deleteData) {
      if (deleteData) {
        res.status(200).send({ status: 1, msg: "Device-patient deleted successfully" });
      } else {
        res.status(200).send({ status: 0, msg: "Device-patient does not exists" });
      }
    })
  }
}

exports.getPrescriptionByPatient = async function (req, res) {
  const prescriptionModel = require("./../utils/sequelizeConn").Prescription;
  let prescription = await prescriptionModel.findAll({
    raw: true,
    where: {
      patient_id: req.params.patient_id,
    },
    order: [
      ["id", "DESC"]
    ]
  });
  var responseData = [];

  if (prescription.length > 0) {

    let created_at_str = prescription[0].created_at.toISOString().replace('T', ' ').replace('.000Z', '');
    let created_at = changeDateFormat(created_at_str.substr(0, 10)) + " " + created_at_str.substr(11);
    let valid_date_str = prescription[0].valid_date.toISOString().replace('T', ' ').replace('.000Z', '');
    let valid_date = changeDateFormat(valid_date_str.substr(0, 10)) + " " + valid_date_str.substr(11);
    let valid_till_str = prescription[0].valid_till.toISOString().replace('T', ' ').replace('.000Z', '');
    let valid_till = changeDateFormat(valid_till_str.substr(0, 10)) + " " + valid_till_str.substr(11);

    if (prescription[0].therapy_name == "NIPD") {
      responseData = [{
        PATIENT_ID: prescription[0].patient_id,
        PRESCRIPTION_ID: prescription[0].id,
        CREATED_BY: prescription[0].doctor_id,
        CREATED_AT: created_at,
        THERAPY_NAME: prescription[0].therapy_name,
        FILL_VOLUME: prescription[0].fill_vol,
        TOTAL_VOLUME: prescription[0].total_vol,
        TOTAL_TIME: prescription[0].total_time,
        VALID_FROM: valid_date,
        VALID_TILL: valid_till
      }];
    } else if (prescription[0].therapy_name == "CCPD" || prescription[0].therapy_name == "CCPD+" || prescription[0].therapy_name == "IPD") {
      responseData = [{
        PATIENT_ID: prescription[0].patient_id,
        PRESCRIPTION_ID: prescription[0].id,
        CREATED_BY: prescription[0].doctor_id,
        CREATED_AT: created_at,
        THERAPY_NAME: prescription[0].therapy_name,
        FILL_VOLUME: prescription[0].fill_vol,
        TOTAL_VOLUME: prescription[0].total_vol,
        TOTAL_TIME: prescription[0].total_time,
        VALID_FROM: valid_date,
        VALID_TILL: valid_till,
        LAST_FILL_VOLUMNE: prescription[0].last_fill_vol
      }];
    } else if (prescription[0].therapy_name == "TIDAL") {
      responseData = [{
        PATIENT_ID: prescription[0].patient_id,
        PRESCRIPTION_ID: prescription[0].id,
        CREATED_BY: prescription[0].doctor_id,
        CREATED_AT: created_at,
        THERAPY_NAME: prescription[0].therapy_name,
        FILL_VOLUME: prescription[0].fill_vol,
        TOTAL_VOLUME: prescription[0].total_vol,
        TOTAL_TIME: prescription[0].total_time,
        VALID_FROM: valid_date,
        VALID_TILL: valid_till,
        LAST_FILL_VOLUMNE: prescription[0].last_fill_vol,
        TIDAL_VOLUME: prescription[0].tidal_vol,
        FULL_DRAIN_EVERY: prescription[0].full_drain_every
      }];
    }
  }
  res.status(200).send(responseData);
}

function changeDateFormat(dateFormatData) {
  let dateFormatArr = dateFormatData.split("-");
  return dateFormatArr[2] + "-" + dateFormatArr[1] + "-" + dateFormatArr[0];
}

// link machine and patient
exports.addMachinePatient = async function (req, res) {
  const device_number = req.body.device_number;
  const patient_id = req.body.patient_id;
  const patient_user_type = req.body.patient_user_type;

  const findPatient = await user.findOne({
    where:
    {
      id: patient_id,
      user_type: patient_user_type
    }
  }).catch(
    (err) => {
      console.log(err);
    }
  );
  const findDevice = await devicesModel.findOne({
    where:
    {
      device_number: device_number,
    }
  }).catch(
    (err) => {
      console.log(err);
    }
  );
  const PatientWithDevice = await devicesModel.findOne({
    where:
    {
      patient_id: patient_id,
    }
  }).catch(
    (err) => {
      console.log(err);
    }
  );
  const machinePatient = {
    patient_id: patient_id,
    device_number: device_number
  }
  if (findPatient) {
    if (PatientWithDevice || findDevice) {
      res.send("device or patient is already in use");
    }
    else {
      devicesModel.create(machinePatient)
        .then(data => {
          res.status(200).send({ Status: 1, data: data });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while adding machine to patient ."
          });
        })
    }
  } 
  else {
    res.send("patient does not exit");
  }

}