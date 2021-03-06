
const superSecret = require('../configure/config').secret;
const jwt = require('jsonwebtoken');

const signUpData = require('../../data/formData').signUpData;
const notRequired = require('../../data/formData').notRequired;


//============input functions==========================
const formatPhone = (num) => {
  return num.split('').filter((n) => {
    const digit = parseInt(n);
    if(n !== NaN) return digit
  }).join('');
};

const checkForm = (obj, form) => {
  return (Object.keys(form)).reduce((a, b) => {
    const required = notRequired.reduce((c, d) => { return c || b === d }, false);
    return a && ((obj[b] !== '' && obj[b] !== undefined) || required);
  }, true);
};

const checkPassword = (obj) => {
  return obj["password"] === obj["Verify Password"];
};

const checkPhone = (num) => {
  //make sure num has <= 11 digits but >= 10 digits
  //10^9 = 100 000 0000
  //10^11 - 1 = 9 999 999 9999
  return num <= (Math.pow(10, 11) - 1) && num >= Math.pow(10, 9);
};

const checkEmail = (mail) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(mail);
};

//==========output========================================
const formatUserInput = (req, res, next) => {
  let newUser = {};
  Object.keys(req.body).map((k) => { newUser[k] = req.body[k]; });
  const cForm = checkForm(newUser, signUpData);

  if(!cForm){
    let err = new Error("*Fill out required fields.");
    err.status = 400;
    return next(err);
  }
  else {
    const pass = checkPassword(newUser);
    const cEmail = checkEmail(newUser.email);

    if(!pass){
      let err = new Error("Passwords do not match.");
      err.status = 400;
      return next(err);
    }
    else if(!cEmail){
      let err = new Error("Incorrect email input.")
      err.status = 400;
      return next(err);
    }
  }

  req.newUser = newUser;
  return next();
};



// verifies token after login
const authorizeUser = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) { // decode token
    jwt.verify(token, superSecret, function(err, decoded) { // verifies secret and checks exp
      if (err) {
        let err = new Error('Session expired. Log back in to continue.');
        err.status = 403;
        next(err);
      }
      else { // if everything is good, save to request for use in other routes
        if(decoded.userID !== req.user.userID){
          let err = new Error("You are not authorized to access this account.");
          err.status = 403;
          return next(err);
        }
        next();
      }
    });
  }
  else {
    let err = new Error('No token provided');
    err.status = 403;
    next(err);
  }
};


// const signInUser = (req, res, next) => {
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
// }



module.exports = {
  formatUserInput,
  authorizeUser
};
