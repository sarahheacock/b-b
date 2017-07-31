const express = require("express");
const ObjectId = require('mongodb').ObjectID;
const lockedUserRoutes = express.Router();

const Page = require("../models/page").Page;
const Available = require("../models/available").Available;
const User = require("../models/user").User;
const Upcoming = require("../models/user").Upcoming;
const mid = require('../middleware');



lockedUserRoutes.param("userID", function(req, res, next, id){
  User.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.user = doc;
    Page.findById(req.user.pageID, function(err, doc){
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
});

//===========================================================
lockedUserRoutes.param("request", function(req,res,next,id){
  //REQUEST OPTIONS===========================================
  if(id === "all"){
    //request for all upcoming
    const parameters = {"event.userID": req.params.userID};
  }
  else { //request is a upcomingID
    const parameters = {_id: id};
  }
  //===============================================================

  Upcoming.find(parameters, function(err, upcoming){
    if(err) return next(err);
    if(!upcoming){
      if(id === "all"){
        req.upcoming = [];
        return next();
      }
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
    return [{
      _id: req.user._id,
      email: req.user.email,
      billing: req.user.billing,
      credit: req.user.credit,
      upcoming: result
    }];
  }
  //res.json([]);
  return [{
    _id: req.user._id,
    email: req.user.email,
    billing: req.user.billing,
    credit: req.user.credit,
    upcoming: []
  }];
}

function formatUser(req, res){
  const username = req.user.email.split("@");
  const billArr = req.user.billing.split('/');
  const d = new Date();

  const billObj = {};
  ["Address Line 1", "Address Line 2", "city", "state", "zip", "country"].forEach(function(add, i){
    billObj[add] = billArr[i]
  });

  return {
    billing: {
      email: req.user.email,
      name: username[0],
      address: billObj
    },
    payment: {
      "Name on Card": req.user.credit.name,
      number: req.user.credit.number,
    }
  };
}
//================GET AND EDIT USER=====================================================
lockedUserRoutes.get("/:userID", mid.authorizeUser, function(req, res, next){
  res.json(formatUser(req, res));
});

//edit user info
lockedUserRoutes.put('/:userID/', mid.authorizeUser, function(req, res, next){
  if(req.body.payment){
    req.user.email = req.body.payment.email;
    req.user.credit = {
      name: req.body.payment["Name on Card"],
      number: req.body.payment["number"],
    }
  }
  if(req.body.billing){
    const billing = req.body.billing;
    const billString = Object.keys(billing.address).map(function(b){
      return billing.address[b];
    }).join('/');
    req.user.billing = billString;
    req.user.email = billing.email;
  }

  req.user.save(function(err, user){
    if(err) return next(err);
    res.status(200);
    res.json(formatUser(req, res));
    //res.json(req.user);
  })
});

//create upcoming
//req.body = current checkout state {selected:..., billing:...., payment:....}
lockedUserRoutes.post("/:userID", mid.authorizeUser, function(req, res, next){
    const newUpcoming = {
      start: req.body.selected.arrive,
      end: req.body.selected.depart,
      title: req.user.email,
      month: new Date(parseInt(req.body.selected.arrive)).getMonth(),
      event: {
        guests: req.body.selected.guests,
        roomID: req.body.selected.roomID._id,
        userID: req.user._id,
        pageID: req.user.pageID,
        paid: req.body.payment.number,
        cost: req.body.selected.cost
      }
    };

    const upcoming = new Upcoming(newUpcoming);

    upcoming.save(function(err, up){
      if(err) return next(err);
      //input for Available updateDates====
      req.start = req.body.start;
      req.end = req.body.end;
      req.roomID = req.body.event.roomID;
      req.dir = true;
      //====================================
      //req.upcoming.push(up);
      next();
    });
  },
  function(req, res, next){ // update what is available
    Available.updateDates(req, function(err, updated){
      if(err) return next(err);
      //res.json(formatOutput(req, res));
      res.json({"message": "success"});
    });

  });

//request === all or monthNum or ID
lockedUserRoutes.get("/:userID/:request", mid.authorizeUser, function(req, res){
  res.json(formatOutput(req, res));
});

//edit one upcoming
// lockedUserRoutes.put("/:userID/:request", mid.authorizeUser, function(req, res){
//
//   if(!(parseInt(req.params.request) >= 0 && parseInt(req.params.request) <= 11) && req.params.request !== "all"){
//     Object.assign(req.upcoming[0], req.body);
//     req.upcoming[0].save(function(err, result){
//       if(err) return next(err);
//       req.upcoming = [result];
//       res.json(formatOutput(req, res));
//     });
//   }
//   else {
//     let err = new Error("Invalid request");
//     return next(err);
//   }
// });




//CANCEL RESERVATION
lockedUserRoutes.delete("/:userID/:request", mid.authorizeUser, function(req, res, next){ // update what is available
  if(req.params.request !== "all"){

    req.end = parseInt(req.upcoming[0].end);
    req.start = parseInt(req.upcoming[0].start);
    req.roomID = req.upcoming[0].event.roomID;
    req.dir = false;

    const parameters = {
      "event.userID": req.user._id,
    };

    Available.updateDates(req, function(err, updated){

      if(err) return next(err);
      req.upcoming[0].remove(function(err){
        if(err) return next(err);
        Upcoming.find(parameters, function(err, up){
          if(err || !up) res.json({});
          req.upcoming = up;
          res.json(formatOutput(req, res));
        });
      });

    });
  }
});



module.exports = lockedUserRoutes;
