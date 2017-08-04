
const signUpData = require('../../data/formData').signUpData;
const notRequired = require('../../data/formData').notRequired;
const addressData = require('../../data/formData').addressData;

const express = require("express");
const pageRoutes = express.Router();
const Page = require("../models/page").Page;
const User = require("../models/user").User;

const configure = require('../configure/config');
const Slack = require('node-slack');
const slack = new Slack(configure.url);


pageRoutes.param("pageID", function(req, res, next, id){
  Page.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Page Not Found");
      err.status = 404;
      return next(err);
    }
    req.page = doc;
    return next();
  });
});

const formatPageOutput = (obj) => {
  let response = {};
  const keys = ["home", "about", "rooms", "localGuide"];
  keys.forEach((k) => ( response[k] = obj[k] ));
  return response;
};

const checkForm = (obj, form) => {
  return (Object.keys(form)).reduce((a, b) => {
    const required = notRequired.reduce((c, d) => { return c || b === d }, false);
    console.log("required", required);
    return a && ((obj[b] !== '' && obj[b] !== undefined) || required);
  }, true);
}

const checkPassword = (obj) => {
  return obj["password"] === obj["Verify Password"];
}
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
pageRoutes.post('/user-setup', function(req, res, next){
  const pass = checkPassword(req.body);
  const cForm = checkForm(req.body, signUpData);
  console.log("pass", pass);
  console.log("cForm", cForm);

  if(!pass){
    let err = new Error("Passwords do not match.");
    return next(err);
  }
  if(!cForm){
    console.log
    let err = new Error("*Fill out required fields.");
    return next(err);
  }

  const billing = Object.keys(addressData).map(function(b){
    return req.body[b];
  }).join("/");
  // const body = {...req.body, billing};

  let user = new User(req.body);
  user.billing = billing;
  console.log("user", user);

  user.save(function(err, user){
    if(err){
      err = new Error("User not created");
      err.status = 404;
      return next(err);
    }
    res.status(201);
    res.json(user);
  });
});


//===================GET SECTIONS================================

pageRoutes.post('/page-setup', function(req, res, next){
  const page = new Page(req.body);
  page.save(function(err, page){
    if(err){
      err = new Error("Page not created");
      err.status = 404;
      return next(err);
    }
    res.status(201);
    res.json(page)
  });
})

//get page
pageRoutes.get('/:pageID', function(req, res, next){
  res.status(200);
  res.json(formatPageOutput(req.page));
});


module.exports = pageRoutes;
