const express = require("express");
const path = require('path');
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require('./configure/config');

const testConfig = require('config'); //we load the db location from the JSON files
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};


const refreshRoutes = express.Router();
// const roomRoutes = require("./controllers/routes/roomRoutes");
const pageRoutes = require("./routes/pageRoutes");
// const lockedAdminRoutes = require("./controllers/routes/lockedAdminRoutes");
const userRoutes = require("./routes/userRoutes");


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

refreshRoutes.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
//===============================================================
refreshRoutes.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

//=================ROUTES=======================================

// apply the routes to our application with the prefix /api
app.use('/page', pageRoutes);
app.use('/user', userRoutes);
// app.use('/rooms', roomRoutes);
//
// app.use("/api", adminAuthRoutes);
// app.use('/api/admin', lockedAdminRoutes); // ROUTES THAT NEED ADMIN ATHENTICATION
//
// app.use('/locked', userAuthRoutes);
// app.use('/locked/user', lockedUserRoutes); // ROUTES THAT NEED USER AUTHENTICATION

app.use(refreshRoutes);

//===========================================================
//==========================================================
//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

//=======START SERVER========================================
const port = process.env.PORT || 5000;
// const port = 8080;

app.listen(port, function(){
  console.log("Express server is listening on port ", port);
});

module.exports = app;
