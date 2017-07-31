const express = require("express");
const ObjectId = require('mongodb').ObjectID;
const lockedAdminRoutes = express.Router();

const Page = require("../models/page").Page;
const Available = require("../models/available").Available;
const Upcoming = require("../models/user").Upcoming;
const mid = require('../middleware');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


lockedAdminRoutes.param("pageID", function(req, res, next, id){
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


lockedAdminRoutes.param("request", function(req,res,next,id){
  //REQUEST OPTIONS===========================================
  if(id === "all"){
    //request for all upcoming
    const parameters = {"event.pageID": req.params.pageID};
  }
  else if(parseInt(id) >= 0 && parseInt(id) <= 11){
    //if request is for a month
    const ID = parseInt(id);
    const orArr = [ID - 1, ID, ID + 1].map(function(i){
      if(i < 0) return {month: 11};
      else if (i > 11) return {month: 0};
      else return {month: i};
    });

    const parameters = {
      "event.pageID": req.params.pageID,
      $or: orArr
    };
  }
  else { //request is a upcomingID
    const parameters = {_id: id};
  }
  //===============================================================

  Upcoming.find(parameters, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      let err = new Error("Upcoming Not Found");
      err.status = 404;
      return next(err);
    }
    req.upcoming = upcoming;
    next();
  });
});

//this is to format upcoming output
function formatOutput(req, res){
  if(req.upcoming.length > 0){
    const result = req.upcoming.map(function(u){
      const roomTitle = req.page.rooms.id(u.event.roomID).title;
      const roomImage = req.page.rooms.id(u.event.roomID).image;
      return {
        _id: u._id,
        start: u.start,
        end: u.end,
        title: u.title,
        month: u.month,
        event: {
          guests: u.event.guests,
          roomID: {
            title: roomTitle,
            image: roomImage
          },
          userID: u.event.userID,
          pageID: u.event.pageID,
          paid: u.event.paid,
          checkedIn: u.event.checkedIn,
          notes: u.event.notes,
          createdAt: u.event.createdAt,
        }
      };
    });
    //res.json(result);
    return result;
  }
  //res.json([]);
  return [];
}

lockedAdminRoutes.param("section", function(req,res,next,id){
  req.section = req.page[id];
  if(!req.section){
    let err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});


lockedAdminRoutes.param("sectionID", function(req, res, next, id){
  req.oneSection = req.section.id(id);
  if(!req.oneSection){
    let err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//====================EDIT UPCOMING===========================================================
//create upcoming
lockedAdminRoutes.post("/:pageID/", mid.authorizeAdmin, function(req, res, next){
  const newUpcoming = {
    start: req.body.selected.arrive,
    end: req.body.selected.depart,
    title: req.body.billing.email,
    month: new Date(parseInt(req.body.selected.arrive)).getMonth(),
    event: {
      guests: req.body.selected.guests,
      roomID: req.body.selected.roomID._id,
      pageID: req.page._id,
      cost: req.body.selected.cost
    }
  };
  const upcoming = new Upcoming(newUpcoming);
  //upcoming.event.pageID = req.page._id;
  //upcoming.month = new Date(parseInt(req.body.start)).getMonth();

  upcoming.save(function(err, up){
    if(err) return next(err);
    //req.upcoming.push(up);
    req.start = req.body.start;
    req.end = req.body.end;
    req.roomID = req.body.event.roomID;
    req.dir = true;
    next();
  });
},
function(req, res, next){ // update what is available
  Available.updateDates(req, function(err){
    if(err) return next(err);
    res.json({"message": "success"})
    //res.json(formatOutput(req, res));
  });
});

//request === all or monthNum or ID
lockedAdminRoutes.get("/:pageID/:request", mid.authorizeAdmin, function(req, res){
  //res.json(req.upcoming);
  res.json(formatOutput(req, res));
});

//check-in client
lockedAdminRoutes.put("/:pageID/:request", mid.authorizeAdmin, function(req, res){

  if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
    req.upcoming[0].event.checkedIn = new Date();
    req.upcoming[0].save(function(err, result){
      if(err) return next(err);
      req.upcoming = [result];
      res.json(formatOutput(req, res));
    });
  }
  else {
    let err = new Error("Invalid request");
    return next(err);
  }
});

//delete one upcoming
lockedAdminRoutes.delete("/:pageID/:request", mid.authorizeAdmin, function(req, res, next){ // update what is available
  if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){

    console.log("upcoming", req.upcoming[0]);
    req.end = parseInt(req.upcoming[0].end);
    req.start = parseInt(req.upcoming[0].start);
    req.roomID = req.upcoming[0].event.roomID;
    req.dir = false;

    const ID = req.upcoming[0].month;
    const orArr = [ID - 1, ID, ID + 1].map(function(i){
      if(i < 0) return {month: 11};
      else if (i > 11) return {month: 0};
      else return {month: i};
    });
    const parameters = {
      "event.pageID": req.params.pageID,
      $or: orArr
    };

    Available.updateDates(req, function(err, updated){

      if(err) return next(err);
      req.upcoming[0].remove(function(err){
        if(err) return next(err);
        Upcoming.find(parameters, function(err, up){
          if(err || !up) res.json([]);
          req.upcoming = up;
          res.json(formatOutput(req, res));
        });
      });

    });
  }
});


//======================EDIT PAGE==============================
lockedAdminRoutes.get("/:pageID/page/:section", mid.authorizeAdmin, function(req, res){
  res.json(req.section);
});

//add section
lockedAdminRoutes.post("/:pageID/page/:section", mid.authorizeAdmin, function(req, res, next){

  req.section.push(req.body);
  req.page.save(function(err, page){
    if(err) return next(err);
    res.status(201);

    if(req.params.section === "rooms"){ //update available if change in rooms
      Available.find({pageID: req.params.pageID}, function(err, available){

        if(!available || err){
          let err = new Error("Not Found");
          next(err);
        }
        available.forEach(function(a, index){
          a.free.push({roomID:page._id});
          a.save(function(err, newA){
            if(err) next(err);
            else if (index === available.length - 1) res.json(page[req.params.section]);
            //res.json({page:page, available:available});
          });
        });
      });
    }
    else {
      res.json(page[req.params.section]);
    }
  });
});



lockedAdminRoutes.get("/:pageID/page/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  res.json(req.oneSection);
});

//edit section
lockedAdminRoutes.put("/:pageID/page/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  Object.assign(req.oneSection, req.body);
  req.page.save(function(err, result){
    if(err){
      return next(err);
    }
    res.json(result[req.params.section]);
  });
});


//delete section
lockedAdminRoutes.delete("/:pageID/page/:section/:sectionID", mid.authorizeAdmin, function(req, res){
  req.oneSection.remove(function(err){
    req.page.save(function(err, page){
      if(err) return next(err);
      if(req.params.section === "rooms"){ //update available if change in rooms
        Available.find({pageID: req.params.pageID}, function(err, available){

          if(!available){
            let err = new Error("Not Found");
            next(err);
          }
          available.forEach(function(a, index){
            const filtered = a.free.filter(function(item){
              return item.roomID !== req.params.sectionID;
            });
            filtered.save(function(err, newA){
              if(err) next(err);
              else if (index === available.length - 1) res.json({page:page, available:available});
            });
          });
        });
      }
      else {
        res.json(page[req.params.section]);
      }

    })
  })
});




module.exports = lockedAdminRoutes;
