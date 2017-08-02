const express = require("express");

const roomRoutes = express.Router();
const Page = require("../models/page").Page;
const Available = require("../models/available").Available;
const ObjectID = require("mongodb").ObjectID


roomRoutes.param("pageID", function(req, res, next, id){

  let day = new Date();
  day.setHours(1);

  Available.remove({ date: {$lt: day}}).exec(function(err){
    if(err) return next(err);
    req.page = id;
    next();
  })
});

roomRoutes.param("date", function(req, res, next, id){
  //console.log(req.page.length)
  //if(req.page.length === undefined) req.date = []; return next();
  Available.findOne({ date: new Date(parseInt(id)), pageID: req.page }).exec(function(err, doc){
    if(err){
      return next(err);
    }

    if(!doc){
      err = new Error("date not found");
      err.status = 404;
      //req.date = [];
      return next(err);
    }

    req.date = doc;
    next();
  })
});





//===================ADD DATES===================================
roomRoutes.post("/", function(req, res, next){

  Page.findById(req.body.pageID, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    const newAvailable = doc.rooms.map(function(d){
      return {roomID: d._id, reserved: 0};
    });

    const room = new Available({
      pageID: req.body.pageID,
      date: new Date(parseInt(req.body.date)),
      free: newAvailable
    });

    room.save(function(err, r){
      if(err) return next(err);
      res.status(201);
      res.json(r);
    });
  });

});

roomRoutes.get("/:pageID", function(req, res, next){
    res.json(req.page);
});

roomRoutes.get("/:pageID/:date", function(req, res, next){
    res.json(req.date);
});




module.exports = roomRoutes;
