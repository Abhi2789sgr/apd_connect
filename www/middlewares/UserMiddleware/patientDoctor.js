"use strict";

const { async } = require("q");
const patientDoctor = require("../../models/patientdoctor");
// const doctor = require("../models/doctor");
const PatientDoctor = require("../../utils/sequelizeConn").PatientDoctor;
const User = require("./../../utils/sequelizeConn").User;


exports.getPatientDoctor = async function (userId) {
  // Assuming you have the user object or the user ID
  const user = await User.findByPk(userId);
  if (user) {
    // Get all patient_doctor relation
    const patientDoctorRel = await PatientDoctor.findAll();
    return patientDoctorRel;
  } else {
    return false;
  }
};

exports.addPatientDoctor = async function (patientID, doctorId, info) {
  // console.log("logged user : ", req.user.id);
  //info should contain assigned_by, start_date, end_date
  console.log("info : ", info);
  try {
    let doctor = await Doctor.findByPk(doctorId);
    const patient = await Patient.findByPk(patientID);
    // Check if the association already exists
    const associationExists = await patient.hasDoctor(doctor);

    if (!associationExists) {
      console.log("has asso : ", associationExists);
      console.log("patient : ", patient);
      console.log("Doctor : ", doctor);
      // Associating the doctor with the patient
      const result = await patient.addDoctor(doctor, {
        through: {
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
  return info;
};

//find whether patient doctor relation exists
exports.findPatientById = async function (patientId) {
  return await PatientDoctor.findOne({
    where: { PatientId: patientId },
  }).then(function (result) {
    return result;
  });
};


//delete patient doctor relation if exists
exports.deletePatientDoctorRelation = async function (patientId) {
  return await PatientDoctor.destroy({
    where: {
      PatientId: patientId,
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