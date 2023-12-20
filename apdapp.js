const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser')

let config = require(__dirname+'/'+env+'_config');
config.root = __dirname;

const requireWalk = require(config.root+'/www/utils/requireWalk').requireWalk;

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));


app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:4200','http://127.0.0.1:4200','http://127.0.0.1:5000','http://localhost:5000','http://192.168.1.22'];
      var origin = req.headers.origin;
      if(allowedOrigins.indexOf(origin) > -1){
           res.setHeader('Access-Control-Allow-Origin', origin);
      }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("",express.static(config.root+"/apdui"));
app.use("/uploads", express.static(__dirname + "/uploads"));

require('./www/middlewares/passport').LocalStrategyFunction(passport, config);
require('./www/middlewares/passport').JwtStrategyFunction(passport, config);

app.use(session({
    key: config.cookieKey,
    secret: config.cookieSecret,
    cookie: { secure:true},
}));

app.use(passport.initialize());
app.use(passport.session());

const requireRoutes = requireWalk(config.root+'/www/routes');
requireRoutes(config, app, passport);

app.get('/uploads',function (req, res) {
    res.sendFile(path.join(config.root+'/uploads/index.html'));
});

app.get('*',function (req, res) {
    res.sendFile(path.join(config.root+'/apdui/index.html'));
});


const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

const server = https.createServer(options, app);

server.listen(config.port, () => {
    console.log('listening on *:3000');
});
