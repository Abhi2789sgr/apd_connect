"use strict";

const { async } = require("q");
const PatientDoctor = require("./../utils/sequelizeConn").PatientDoctor;
const User = require("./../utils/sequelizeConn").User;
const patient_detail = require("./../utils/sequelizeConn").patient_detail;
const axios = require('axios');
const https = require('https');
const { response } = require("express");

// link doctor and patient
exports.addDoctorPatient = async function (req, res) {
  const doctor_id = req.body.doctor_id;
  const patient_id = req.body.patient_id;
  const findPatient = await User.findOne({
    raw: true,
    where: {
      id: patient_id,
      user_type: 5
    }
  });
  if (findPatient != null && findPatient.id == patient_id) {
    const findDoctor = await User.findOne({
      raw: true,
      where: {
        id: doctor_id,
        user_type: 4
      }
    });

    if (findDoctor != null && findDoctor.id == doctor_id) {
      const doctorPatient = {
        patient_id: patient_id,
        doctor_id: doctor_id
      }

      PatientDoctor.findAll({
        raw: true,
        where: {
          doctor_id: doctor_id,
          patient_id: patient_id
        }
      }).then((doctorPatientRel) => {
        console.log('the linked data is', doctorPatientRel);
        if (doctorPatientRel.length == 0) {
          PatientDoctor.create(doctorPatient).then((createData) => {
            res.status(200).send({ status: 1, data: data });
          }, (error) => {
            res.status(200).send({ status: 0, msg: "Error occurred while linking, please try later" });
          });
        } else {
          res.status(200).send({ status: 0, msg: "Patient already linked to doctor" });
        }
      });
    } else {
      res.status(200).send({ status: 0, msg: "Doctor does not exist" });
    }
  } else {
    res.status(200).send({ status: 0, msg: "Patient does not exist" });
  }

}

// add report for patient.....
exports.patientReportDetails = async function (req, res) {
  // console.log("hwvfosdv");
  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });
  await axiosInstance.post('https://localhost:3000/api/v1/users/doctors/patientReportData')
    .then(function (response) {
      // handle success
      var Data = response.data
      console.log(Data);
      res.status(200).send({Data});
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  // var patient_report = {
  //   DEV_NO : req.body.DEV_NO,
  //   P_NAME : req.body.P_NAME,
  //   P_ID : req.body.P_ID,
  //   SEX : req.body.SEX,
  //   AGE	 : req.body.AGE,
  //   WEIGHT : req.body.WEIGHT,
  //   HEIGHT : req.body.HEIGHT,
  //   BSA : req.body.BSA,
  //   ADDR : req.body.ADDR,
  //   PRI_BAG_BATCH : req.body.PRI_BAG_BATCH,
  //   PRI_DEXT_CONEC : req.body.PRI_DEXT_CONEC,
  //   SEC_BAG_BATCH : req.body.SEC_BAG_BATCH,
  //   SEC_DEXT_CONEC : req.body.SEC_DEXT_CONEC,
  //   TOT_PRI_VOL : req.body.TOT_PRI_VOL,
  //   INIT_DRAIN_VOL : req.body.INIT_DRAIN_VOL,
  //   LAST_FILL_VOL : req.body.LAST_FILL_VOL,
  //   INF_BYPASS : req.body.INF_BYPASS,
  //   TOT_FILL_VOL : req.body.TOT_FILL_VOL,
  //   TOT_INF_VOL : req.body.TOT_INF_VOL,
  //   TOT_DRAIN_VOL : req.body.TOT_DRAIN_VOL,
  //   ULTRA_FILTR : req.body.ULTRA_FILTR,
  //   DWELL_BUPASS : req.body.DWELL_BUPASS,
  //   TOT_DWELL_TIME : req.body.TOT_DWELL_TIME,
  //   TOT_DRAIN_TIME : req.body.TOT_DRAIN_TIME,
  //   TOT_CYCLES : req.body.TOT_CYCLES,
  //   DRAIN_BYPASS : req.body.DRAIN_BYPASS,
  //   DATE : req.body.DATE,
  //   MONTH : req.body.MONTH,
  //   YEAR : req.body.YEAR,
  //   HOUR : req.body.HOUR,
  //   MIN	 : req.body.MIN,
  //   SEC	 : req.body.SEC,
  //   TH_NAME	 : req.body.TH_NAME,
  //   TH_MODE	 : req.body.TH_MODE,
  //   CY_DATA : req.body.CY_DATA
  // }
  // patient_detail.create(patient_report).then((data) => {
  //   res.status(200).send({status: 1, data : data});
  // },(error)=>{
  //   res.status(200).send({status: 0, data: [], msg: "Error while adding patient details", err: error})
  // })
};
exports.patientReportData = function (req, res) {

  var Data = req.body;
  // console.log(Data);
  res.status(200).send({msg:"ok", Data });
}