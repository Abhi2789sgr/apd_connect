"use strict";

const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const q = require("q");
const jsonwebtoken = require("jsonwebtoken");
const jwtOptions = {};
const request = require("request");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const User = require("./../utils/sequelizeConn").User;
exports.LocalStrategyFunction = function (passport, config) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function (email, password, done) {
        // const User = require("./../utils/sequelizeConn").User;
        const md5pass = crypto.createHash("md5").update(password).digest("hex");
        User.findOne({
          where: { email: email, password: md5pass },
        }).then(function (user) {
          if (user != null && user.dataValues != undefined) {
            const userData = user.dataValues;
            // console.log(userData);
            if (parseInt(userData.status) == 1) {
              var user = {
                id: userData.id,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                user_type: userData.user_type,
                mobile_no: userData.mobile_no
              };
            }
            returnAuthuser(user, config).then(function (returnUserObj) {
              return done(null, returnUserObj);
            });
          } else {
            return done(null, { token: "", status: 0 });
          }
        });
      }
    )
  );

  exports.JwtStrategyFunction = (passport, config) => {
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = config.jwtSecret;
    //creating a function and exporting it
    passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
      User.findOne({ where: { id: jwt_payload.id } })
        .then(user => {
          if (user) {
            let usr = makeUserObject(user);
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          console.log(err);
        });
    }
    ));
  };

  passport.serializeUser(function (user, done) {
    console.log("SerializeUser");
    console.log(user);
    return done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log("DeserializeUser");
    console.log(user);
    const User = require("./../utils/sequelizeConn").User;
    User.findOne({
      where: { id: user.id },
    }).then(function (userData) {
      if (userData != null && userData.dataValues != undefined) {
        console.log(userData.dataValues);
        done(null, user);
      } else {
        console.log("user-nulll");
        done(null, false);
      }
    });
  });
};

let makeUserObject = function (userData) {
  var user = {
    id: userData.id,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    mobile_no: userData.mobile_no
  };
  return user;
};

let returnAuthuser = function (user, config) {
  let deferred = q.defer();

  var token = jsonwebtoken.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpire, // expires in 8 hours, expressed in seconds
  });
  user.token = token;

  deferred.resolve(user);

  return deferred.promise;
};


