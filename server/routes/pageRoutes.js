const nodemailer = require('nodemailer');
const express = require("express");

const pageRoutes = express.Router();
const Page = require("../models/page").Page;
const Available = require("../models/available").Available;
const User = require("../models/user").User;

const config = require('../configure/config');


pageRoutes.param("pageID", function(req, res, next, id){
  Page.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.page = doc;
    return next();
  });
});

pageRoutes.param("section", function(req,res,next,id){
  req.section = req.page[id];
  if(!req.section){
    let err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  if(req.section === 'upcomings'){
    let err = new Error("Not Permitted");
    err.status = 401;
    return next(err);
  }
  next();
});


//================MAIL==================================
pageRoutes.post("/sayHello", function(req, res) {
    // Not the movie transporter!
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
        auth: {
            user: config.user, // Your email id
            pass: config.pass // Your password
        }
    });

    //const text = 'Hello world from \n\n' + req.body.name;

    const mailOptions = {
        from: '"Nancy Darr" <balanace.test@gmail.com>', // sender address
        to: config.to, // list of receivers
        subject: 'Web Site Message', // Subject line
        //text: text //, // plaintext body
        html: req.body.message // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
            res.json({yo: 'error'});
        }
        else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
});

//create user
pageRoutes.post('/user-setup', function(req, res, next) {
  const billing = Object.key(req.body.billing).map(function(b){
    return req.body.billing[b];
  }).join("/");

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    billing: billing
  });

  user.save(function(err, user){
    if(err) return next(err);
    res.status(201);
    res.json(user);
  });
});


//===================GET SECTIONS================================
//get page

//get section
pageRoutes.get("/:pageID/:section", function(req, res){
  res.json(req.section);
});



module.exports = pageRoutes;
