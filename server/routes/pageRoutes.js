const express = require("express");
const pageRoutes = express.Router();
const Page = require("../models/page").Page;

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
