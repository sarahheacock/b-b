const express = require("express");

const pageRoutes = express.Router();
const Page = require("../models/page").Page;
// const Available = require("../models/available").Available;
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
  const billing = Object.key(req.body.billing).map(function(b){
    return req.body.billing[b];
  }).join("/");

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    billing: billing
  });

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
  const page = new Page({
    username: "test",
    password: "pass"
  });

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
  res.json(req.page);
});


module.exports = pageRoutes;


// // const express = require("express");
//
// // const pageRoutes = express.Router();
// const Page = require("../models/page").Page;
// // const Available = require("../models/available").Available;
// const User = require("../models/user").User;
//
// const configure = require('../configure/config');
//
// const Slack = require('node-slack');
// const slack = new Slack(configure.url);
//
//
// //================MAIL==================================
// const sayHello = (req, res) => {
//   slack.send({
//     text: req.body.message,
//     channel: '#portfolio',
//     username: req.body.name,
//     attachments: [
//       {
//         title: 'Phone Number',
//         text: req.body.phone
//       },
//       {
//         title: 'Email Address',
//         text: req.body.email
//       }
//     ]
//   });
//   res.json({success: true});
// };
//
//
// //create user
// const userSetup = (req, res, next) => {
//   const billing = Object.key(req.body.billing).map(function(b){
//     return req.body.billing[b];
//   }).join("/");
//
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     billing: billing
//   });
//
//   user.save(function(err, user){
//     if(err){
//       err = new Error("User not created");
//       err.status = 404;
//       return next(err);
//     }
//     res.status(201);
//     res.json(user);
//   });
// };
//
//
// //===================GET SECTIONS================================
// const pageSetup = (req, res) => {
//   const page = new Page({
//     username: "test",
//     password: "pass"
//   });
//
//   page.save(function(err, page){
//     if(err){
//       err = new Error("Page not created");
//       err.status = 404;
//       return next(err);
//     }
//     res.status(201);
//     res.json(page)
//   });
// };
//
// //get page
// const getPage = (req, res, next) => {
//   const id = req.params.pageID;
//   Page.findById(id, function(err, doc) {
//     if(err) return next(err);
//     if(!doc){
//       err = new Error("Page Not Found");
//       err.status = 404;
//       return next(err);
//     }
//     res.json(doc);
//   });
// };
//
//
// module.exports = {sayHello, userSetup, pageSetup, getPage};
