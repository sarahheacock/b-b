const express = require("express");
const path = require('path');
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require('./configure/config');

const testConfig = require('config'); //we load the db location from the JSON files
//db options
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};


// const adminAuthRoutes = express.Router();
// const userAuthRoutes = express.Router();
// const refreshRoutes = express.Router();


// const Page = require("./models/page").Page;
// const Available = require("./controllers/models/available").Available;
// const User = require("./controllers/models/user").User;
const jwt = require('jsonwebtoken');


// const roomRoutes = require("./controllers/routes/roomRoutes");
const pageRoutes = require("./routes/pageRoutes");
// const lockedAdminRoutes = require("./controllers/routes/lockedAdminRoutes");
// const lockedUserRoutes = require("./controllers/routes/lockedUserRoutes");


//=====CONFIGURATION=============================
mongoose.connect(testConfig.DBHost, options); //connect to database
app.set('superSecret', config.secret); //set secret variable

// app.use(jsonParser());
// app.use(logger("dev"));


const db = mongoose.connection;
db.on("error", function(err){
  console.error("connection error:", err);
});
db.once("open", function(){
  console.log("db connection successful");
});

//don't show the log when it is test
// if(config.util.getEnv('NODE_ENV') !== 'test') {
//   //use morgan to log at command line
  //  app.use(morgan('dev')); //'combined' outputs the Apache style LOGs
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// app.route("/say-hello")
//   .post(pageRoutes.sayHello);
//
// app.route("/user-setup")
//   .post(pageRoutes.userSetup);
//
// app.route("/page")
//   .post(pageRoutes.pageSetup);
//
// app.route("/page/:pageID")
//   .get(pageRoutes.getPage);



// refreshRoutes.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
//========================ADMIN LOGIN====================================
// POST /login
// adminAuthRoutes.post('/login', function(req, res, next) {
//   if (req.body.username && req.body.password) {
//     Page.authenticate(req.body.username, req.body.password, function (error, user) {
//       if (error || !user) {
//         let err = new Error(config.loginError);
//         err.status = 401;
//         return next(err);
//       }
//       else {
//         var token = jwt.sign({adminID: user.adminID}, app.get('superSecret'), {
//           expiresIn: '1d' //expires in one day
//         });
//
//         res.json({
//           admin: true,
//           token: token,
//           id: user._id,
//           username: user.username
//         });
//       }
//     });
//   }
//   else {
//     let err = new Error(config.loginError);
//     err.status = 401;
//     return next(err);
//   }
// });
//
// // route middleware to verify a token
// adminAuthRoutes.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   const token = req.body.token || req.query.token || req.headers['x-access-token'];
//
//   if (token) { // decode token
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) { // verifies secret and checks exp
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       }
//       else { // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   }
//   else {
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//   }
// });


//===========================USER LOGIN=========================================
// POST /login
// userAuthRoutes.post('/userlogin', function(req, res, next) {
//   if (req.body.email && req.body.password) {
//     User.authenticate(req.body.email, req.body.password, function (error, user) {
//       if (error || !user) {
//         let err = new Error('Wrong email or password.');
//         err.status = 401;
//         return next(err);
//       }
//       else {
//         const token = jwt.sign({userID: user.userID}, app.get('superSecret'), {
//           expiresIn: '1d' //expires in one day
//         });
//
//         const username = user.email.split("@");
//         const billArr = user.billing.split('/');
//         const d = new Date();
//
//         const billObj = {};
//         ["Address Line 1", "Address Line 2", "city", "state", "zip", "country"].forEach(function(add, i){
//           billObj[add] = billArr[i]
//         });
//
//         res.json({
//           user: {
//             admin: false,
//             token: token,
//             id: user._id,
//             username: username[0]
//           },
//           billing: {
//             name: username[0],
//             email: user.email,
//             address: billObj
//           },
//           payment: {
//       			"Name on Card": user.credit.name,
//             number: user.credit.number,
//           }
//         });
//       }
//     });
//   }
//   else {
//     let err = new Error('Email and password are required.');
//     err.status = 401;
//     return next(err);
//   }
// });
//
// // route middleware to verify a token
// userAuthRoutes.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   const token = req.body.token || req.query.token || req.headers['x-access-token'];
//
//   if (token) { // decode token
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) { // verifies secret and checks exp
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       }
//       else { // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   }
//   else {
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//   }
// });


//===============================================================
// refreshRoutes.get('*', function(request, response) {
//   response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
// });

//=================ROUTES=======================================

// apply the routes to our application with the prefix /api
app.use('/page', pageRoutes);
// app.use('/rooms', roomRoutes);
//
// app.use("/api", adminAuthRoutes);
// app.use('/api/admin', lockedAdminRoutes); // ROUTES THAT NEED ADMIN ATHENTICATION
//
// app.use('/locked', userAuthRoutes);
// app.use('/locked/user', lockedUserRoutes); // ROUTES THAT NEED USER AUTHENTICATION

// app.use(refreshRoutes);

//===========================================================
//==========================================================
//catch 404 and forward to error handler
app.use(function(req, res, next){
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

//=======START SERVER========================================
// const port = process.env.PORT || 5000;
const port = 8080;

app.listen(port, function(){
  console.log("Express server is listening on port ", port);
});

module.exports = app;
