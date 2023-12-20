const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let config = require('./../../'+env+'_config');
// var config = require('./../../dev_config');
var Sequelize = require('sequelize');

var db = {
  sequelize: new Sequelize(
    config.sql_db,
    config.sql_user,
    config.sql_pass,
    {
      host:config.sql_host,
      port:"3306",
      dialect: "mysql",
      logging:false
    }
  )
};
db.User = require('./../models/users')(db.sequelize, Sequelize.DataTypes);
db.Device = require('./../models/devices')(db.sequelize, Sequelize.DataTypes);
db.UserDevice = require('./../models/userdevices')(db.sequelize, Sequelize.DataTypes);
db.PatientDoctor = require('./../models/patientdoctor')(db.sequelize, Sequelize.DataTypes);
db.Prescription = require('./../models/prescription')(db.sequelize, Sequelize.DataTypes);
db.CCDoctor = require('./../models/cc_doctor')(db.sequelize, Sequelize.DataTypes);
db.CCPatient = require('./../models/cc_patient')(db.sequelize, Sequelize.DataTypes);
db.patient_detail = require('./../models/patient_detail')(db.sequelize, Sequelize.DataTypes);
//1-master,2-cr,3-sales,4-cc,5-doctor,6-patient,7-installer,8-customer
//don't recreate db stuff
// db.sequelize.sync({force:true}).then(()=>{
//   console.log("Re-sync is done!")
// })
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
