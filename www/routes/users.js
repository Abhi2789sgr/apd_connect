"use strict";
var multer = require("multer");

module.exports = function (config, app, passport) {


  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, config.root+'/uploads')
      },
      filename: function (req, file, cb) {
          cb(null, file.originalname)
      }
  })
  const upload = multer({
      storage: storage
  })

  // default route
  const userCtrl = require(config.root + "/www/controllers/users");
  const userValidatn = require(config.root + "/www/middlewares/users");
  const patientRelationCtrl = require(config.root +"/www/controllers/patientDoctor");
  const devicesCtrl = require(config.root +"/www/controllers/devices");

  app.post("/api/v1/users/login",passport.authenticate("local", { session: false }),userCtrl.login);
  app.get("/api/v1/users/getUserDetails", passport.authenticate("jwt", { session: false }), userCtrl.getUserDetails);

  app.get("/api/v1/users/doctors/getDoctorPatient", passport.authenticate("jwt", {session: false}), userCtrl.getDoctorPatient);
  app.get("/api/v1/users/doctors/getPatientDoctor/:patient_id", passport.authenticate("jwt", {session: false}), userCtrl.getPatientDoctor);
  app.get("/api/v1/users/doctors/getPrescriptionByPatient/:patient_id", passport.authenticate("jwt", {session: false}), userCtrl.getPrescriptionByPatient);
  app.put("/api/v1/users/doctors/updatePrescriptionByPatient/:patient_id", passport.authenticate("jwt", { session: false }), userCtrl.updatePrescriptionByPatient);
  app.post("/api/v1/users/doctors/uploadPrescriptionImage", passport.authenticate("jwt", { session: false }), upload.single('file'),  userCtrl.uploadPrescriptionImage);

    // find all user types
  app.get("/api/v1/users/admin/getUserCountByType", passport.authenticate("jwt", { session: false }), userCtrl.findAllUserTypeCount);
  app.get("/api/v1/users/admin/getUserListByType/:user_type", passport.authenticate("jwt", { session: false }), userCtrl.findUserTypeDetails);
  app.post("/api/v1/users/admin/createuser", passport.authenticate("jwt", { session: false }), userCtrl.createuser);
  app.put("/api/v1/users/admin/editUserdetails/:id", passport.authenticate("jwt", { session: false }), userCtrl.editUserdetails);
  app.delete("/api/v1/users/admin/userDestroy/:id", passport.authenticate("jwt", { session: false }), userCtrl.userDestroy);

  //link doctor and patient
  // app.get("/api/v1/users/admin/getLinkedDoctor", passport.authenticate("jwt", { session: false }),  )
  app.post("/api/v1/users/admin/addDoctorPatient", passport.authenticate("jwt", { session: false }), patientRelationCtrl.addDoctorPatient);
  app.post("/api/v1/users/admin/addMachinePatient", passport.authenticate("jwt", { session: false }), devicesCtrl.addMachinePatient);

  // add patient details and report
  app.post("/api/v1/users/doctors/patientReportDetails", patientRelationCtrl.patientReportDetails);
  app.post("/api/v1/users/doctors/patientReportData", patientRelationCtrl.patientReportData);
};
   