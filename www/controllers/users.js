"use strict";

const { async, send } = require("q");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const { error } = require("console");
const customer = require("./../utils/sequelizeConn").Customer;
const User = require("./../utils/sequelizeConn").User;
const DoctorPatient = require("./../utils/sequelizeConn").PatientDoctor;
const Sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");

const Op = Sequelize.Op;

exports.login = function (req, res) {
  if (req.user.token != undefined && req.user.token != "") {
    if (parseInt(req.body.user_type) == parseInt(req.user.user_type)) {
      res.status(200).send({ status: 1, msg: "Login Success", data: req.user });
    } else {
      res.status(200).send({ status: 2, msg: "Login Failed, Wrong user type selected", data: null });
    }
  } else {
    res.status(200).send({ status: 2, msg: "Login Failed, Invalid email or password", data: null });
  }
}

exports.getUserDetails = function (req, res) {
  if (req.user) {
    res.status(200).send({ status: 1, msg: "Login Success", data: req.user });
  } else {
    res.status(200).send({ status: 0, msg: "Token expired, please login again", data: null });
  }
}

exports.getDoctorPatient = async function (req, res) {
  var patientDetails = [];
  let docPatient = await DoctorPatient.findAll(
    {
      raw: true,
      attributes: ['patient_id'],
      where: {
        doctor_id: req.user.id
      }
    });
  if (docPatient.length > 0) {
    let patientArr = [];
    docPatient.forEach((docPat, index) => {
      patientArr.push(docPat.patient_id);
    });

    patientDetails = await User.findAll({
      raw: true,
      attributes: ['id', 'first_name', 'last_name', 'email', 'mobile_no', 'status', 'user_type', 'created_at', 'updated_at'],
      where: {
        id: {
          [Op.in]: patientArr
        }
      }
    });
  }
  res.status(200).send({ status: 1, data: patientDetails });
}

exports.getPatientDoctor = async function(req, res){
  let docPatient = await DoctorPatient.findAll({
    raw: true,
    attributes: ['patient_id', 'doctor_id'],
    where: {
      patient_id: req.params.patient_id
    }
  });
  res.status(200).send({status:1, data:docPatient});
}

exports.getPrescriptionByPatient = async function (req, res) {
  const prescriptionModel = require("./../utils/sequelizeConn").Prescription;
  let cond = {
    patient_id: req.params.patient_id
  }
  if(req.user.user_type == 4){
    cond.doctor_id = req.user.id;
  }
  let prescription = await prescriptionModel.findAll({
    raw: true,
    where: cond
  });
  res.status(200).send({ status: 1, data: prescription });
}

exports.updatePrescriptionByPatient = async function (req, res) {
  const prescriptionModel = require("./../utils/sequelizeConn").Prescription;
  let cond = {
    patient_id: req.body.data.patient_id
  }
  if(req.user.user_type == 4){
    cond.doctor_id = req.user.id;
  }
  let prescription = await prescriptionModel.update(req.body.data,
    {
      where: cond
    });
  res.status(200).send({ status: 1, data: prescription });
}

exports.uploadPrescriptionImage = async function (req, res) {
  const prescriptionModel = require("./../utils/sequelizeConn").Prescription;
  let cond = {
    patient_id: eq.body.patient_id
  }
  if(req.user.user_type == 4){
    cond.doctor_id = req.user.id;
  }
  let prescription = await prescriptionModel.update({ prescription_image: req.body.prescription_image },
    {
      where: cond
    });
  res.status(200).send({ status: 1, msg : "Prescription uploaded successfully"});
}


// get the count of all users type.....
exports.findAllUserTypeCount = async (req, res) => {
  const countData = await User.count({
    where:{
      status: 1
    },
    group:['user_type']
  });
  res.status(200).send({ status: 1, data: countData });
};

exports.findUserTypeDetails = (req, res) => {
  // const user_type = req.params.user_type;
  User.findAll({ where: { user_type: req.params.user_type } }).then((data) => {
    res.status(200).send({ status: 1, data: data });
  },(error)=>{
    res.status(200).send({ status: 0, msg: "Error occurred!", err: error });
  })
    
};

exports.createuser = async (req, res) => {
  if(req.user.user_type == 0 || req.user.user_type == 1){
    const users = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: crypto.createHash("md5").update(req.body.password).digest("hex"),
      mobile_no: req.body.mobile_no,
      status: req.body.status,
      user_type: req.body.user_type
    };

    User.create(users).then((data) => {
      res.status(200).send({status: 1, data : data});
    },(error)=>{
      res.status(200).send({status: 0, data: [], msg: "Error will creating user", err: error})
    })
  }
};

exports.editUserdetails = (req, res) => {
  const users = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    mobile_no: req.body.mobile_no,
    status: req.body.status,
  };
  const id = req.params.id;

  User.update(users, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({ status: 1, msg: "User was updated successfully."});
    } else {
      res.status(200).send({ status: 1, msg: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`});
    }
  }, (error)=>{
    res.status(200).send({status: 0, msg: "Error updating User with id=" + id, err: error});
  })
}

exports.userDestroy = (req, res) => {
  if(req.user.user_type == 0 && req.body.passkey == "MitraAdmin!@T123"){
    const id = req.params.id;
    User.destroy({
      where: { id: id }
    }).then((num) => {
      if (num == 1) {
        PatientDoctor.destroy({
          where: {
            patient_id : id
          }
        });
        res.status(200).send({ status: 1, msg: "User was deleted successfully!"});
      } else {
        res.status(200).send({ status: 0, msg: `Cannot delete User with id=${id}. Maybe User was not found!`});
      }
    },(error)=>{
      res.status(200).send({ status: 0, msg: "Unable to delete!", err: error});
    });
  }else{
    res.status(200).send({ status: 0, msg: "You are not authorised to delete the user"});
  }
}