//THESE ROUTES HELP USERS CREATE ACCOUNTS
//ACCESS ACCOUNT INFORMATION
//UPDATE USER BILLING, USER CREDIT, AND UPCOMING
const express = require("express");
const config = require('../configure/config');
const superSecret = config.secret;
const jwt = require('jsonwebtoken');
const userRoutes = express.Router();

const User = require("../models/user").User;
const mid = require('../middleware/middleware');


//creates the checkout.billing in the front end
const addressData = require('../../data/formData').addressData;
const contactData = require('../../data/formData').contactData;
const paymentData = require('../../data/formData').paymentData;

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


const fbOptions = {
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: config.FACEBOOK_CALLBACKURL,
  profileFields: ['id', 'name', 'email']
};

passport.use(new FacebookStrategy(fbOptions,
  (token, refreshToken, profile, next) => {
  User.findOne({email: profile.email}).exec((err, user) => {
    if(err){
      next(err);
    }
    if(!user){
      const newUser = new User({email: profile.email, name: profile.name, facebookID: profile.id});
      newUser.save((err, user) => {
        if(err){
          err = new Error("Unable to create profile.");
          err.status = 400;
          next(err);
        }
        req.user = user;
        next();
      });
    }
    req.user = user;
    next();
  })
}));


//========parameters==================================
// userRoutes.param("userID", (req, res, next, id) => {
//   User.findById(id, function(err, doc){
//     if(err) return next(err);
//     if(!doc){
//       err = new Error("User Not Found");
//       err.status = 404;
//       return next(err);
//     }
//     req.user = doc;
//   });
// });

//=============res.json output================================================
const formatUserOutput = (user) => {
  const token = jwt.sign({userID: user.userID}, superSecret, {
    expiresIn: '1d' //expires in one day
  });

  let billing = {};
  const userBilling = user.billing.split('/');
  (Object.keys(contactData)).forEach((k, i) => {
    if(user[k]) billing[k] = user[k];
    else billing[k] = contactData[k]["default"];
  });
  (Object.keys(addressData)).forEach((k, i) => {
    if(userBilling[i]) billing[k] = userBilling[i];
    else billing[k] = addressData[k]["default"];
  });

  let credit = {};
  (Object.keys(paymentData)).forEach((k, i) => {
    if(user["credit"][k]) credit[k] = user["credit"][k];
    else credit[k] = paymentData[k]["default"];
  });

  return {
    user: {
      admin: false,
      token: token,
      id: user._id,
      username: user.name
    },
    checkout: {
      billing: billing,
      credit: credit,
    }
  }
};


//================GET AND EDIT USER=====================================================
//create user
userRoutes.post('/', mid.formatUserInput, (req, res, next) => {
  const user = new User(req.newUser);

  user.save((err, user) => {
    if(err){
      if(err.message.includes('duplicate')){
        err = new Error("Email provided has already been used.");
        err.status = 400;
      }
      return next(err);
    }

    res.status(201);
    res.json(formatUserOutput(user));
  });
});

userRoutes.post('/login', (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if(err) return next(err);

    res.status(200);
    res.json(formatUserOutput(user));
  });
});

userRoutes.get('/facebook', passport.authenticate('facebook'));

userRoutes.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
    res.status(200);
    res.json(formatUserOutput(req.user));
  });


// lockedUserRoutes.get("/:userID", mid.authorizeUser, function(req, res, next){
//   res.json(formatUser(req, res));
// });
//
// //edit user info
// lockedUserRoutes.put('/:userID/', mid.authorizeUser, function(req, res, next){
//   if(req.body.payment){
//     req.user.email = req.body.payment.email;
//     req.user.credit = {
//       name: req.body.payment["Name on Card"],
//       number: req.body.payment["number"],
//     }
//   }
//   if(req.body.billing){
//     const billing = req.body.billing;
//     const billString = Object.keys(billing.address).map(function(b){
//       return billing.address[b];
//     }).join('/');
//     req.user.billing = billString;
//     req.user.email = billing.email;
//   }
//
//   req.user.save(function(err, user){
//     if(err) return next(err);
//     res.status(200);
//     res.json(formatUser(req, res));
//     //res.json(req.user);
//   })
// });
//
// //create upcoming
// //req.body = current checkout state {selected:..., billing:...., payment:....}
// lockedUserRoutes.post("/:userID", mid.authorizeUser, function(req, res, next){
//     const newUpcoming = {
//       start: req.body.selected.arrive,
//       end: req.body.selected.depart,
//       title: req.user.email,
//       month: new Date(parseInt(req.body.selected.arrive)).getMonth(),
//       event: {
//         guests: req.body.selected.guests,
//         roomID: req.body.selected.roomID._id,
//         userID: req.user._id,
//         pageID: req.user.pageID,
//         paid: req.body.payment.number,
//         cost: req.body.selected.cost
//       }
//     };
//
//     const upcoming = new Upcoming(newUpcoming);
//
//     upcoming.save(function(err, up){
//       if(err) return next(err);
//       //input for Available updateDates====
//       req.start = req.body.start;
//       req.end = req.body.end;
//       req.roomID = req.body.event.roomID;
//       req.dir = true;
//       //====================================
//       //req.upcoming.push(up);
//       next();
//     });
//   },
//   function(req, res, next){ // update what is available
//     Available.updateDates(req, function(err, updated){
//       if(err) return next(err);
//       //res.json(formatOutput(req, res));
//       res.json({"message": "success"});
//     });
//
//   });
//
// //request === all or monthNum or ID
// lockedUserRoutes.get("/:userID/:request", mid.authorizeUser, function(req, res){
//   res.json(formatOutput(req, res));
// });
//
// //edit one upcoming
// // lockedUserRoutes.put("/:userID/:request", mid.authorizeUser, function(req, res){
// //
// //   if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
// //     Object.assign(req.upcoming[0], req.body);
// //     req.upcoming[0].save(function(err, result){
// //       if(err) return next(err);
// //       req.upcoming = [result];
// //       res.json(formatOutput(req, res));
// //     });
// //   }
// //   else {
// //     let err = new Error("Invalid request");
// //     return next(err);
// //   }
// // });
//
//
//
//
// //CANCEL RESERVATION
// lockedUserRoutes.delete("/:userID/:request", mid.authorizeUser, function(req, res, next){ // update what is available
//   if(req.params.request !== "all"){
//
//     req.end = parseInt(req.upcoming[0].end);
//     req.start = parseInt(req.upcoming[0].start);
//     req.roomID = req.upcoming[0].event.roomID;
//     req.dir = false;
//
//     const parameters = {
//       "event.userID": req.user._id,
//     };
//
//     Available.updateDates(req, function(err, updated){
//
//       if(err) return next(err);
//       req.upcoming[0].remove(function(err){
//         if(err) return next(err);
//         Upcoming.find(parameters, function(err, up){
//           if(err || !up) res.json({});
//           req.upcoming = up;
//           res.json(formatOutput(req, res));
//         });
//       });
//
//     });
//   }
// });



module.exports = userRoutes;
