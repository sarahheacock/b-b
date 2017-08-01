const express = require("express");

const pageRoutes = express.Router();
const Page = require("../models/page").Page;
const Available = require("../models/available").Available;
const User = require("../models/user").User;

const config = require('../configure/config');

const Slack = require('node-slack');
const slack = new Slack(config.url);


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
pageRoutes.post("/sayHello", function(req, res){
  slack.send({
    text: req.body.message,
    channel: '#portfolio',
    username: req.body.name,
    attachments: [
      {
        title: 'Phone Number',
        text: req.body.phone
      },
      {
        title: 'Email Address',
        text: req.body.email
      }
    ]
  });
  res.json({success: true});
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
pageRoutes.get("/:pageID", function(req, res){
  res.json(req.page);
});

//get section
pageRoutes.get("/:pageID/:section", function(req, res){
  res.json(req.section);
});



module.exports = pageRoutes;
