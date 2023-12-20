"use strict";

module.exports = function (config, app, passport) {
  // default route
  const devicesCtrl = require(config.root + "/www/controllers/devices");
  /*if in the request body user id is given then entry is made in userDevice table based on that id else id of logged in user is considered*/
  app.get("/api/v1/devices",passport.authenticate("jwt", { session: false }),devicesCtrl.getUserDevices);
  app.post("/api/v1/devices",passport.authenticate("jwt", { session: false }),devicesCtrl.registerdevice);
  app.delete("/api/v1/devices", devicesCtrl.deleteDevice);
  app.delete("/api/v1/devicesPatient", devicesCtrl.removePatientDeviceRelation);
  app.post("/api/v1/checkDevice", devicesCtrl.checkDevice);
  app.get("/api/v1/device/getPrescriptionByPatient/:patient_id", devicesCtrl.getPrescriptionByPatient);
};
