const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const temp = new Date().toString().split(' ');
const NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();


const UpcomingSchema = new Schema({
  start: Number,
  end: Number,
  title: String, //email and name of customer
  month: Number,
  event: {
    guests: Number,
    roomID: Schema.Types.ObjectId,
    userID: Schema.Types.ObjectId,
    pageID: Schema.Types.ObjectId,
    paid: {type:String, default:''},
    checkedIn: Date,
    notes: '',
    cost: Number,
    createdAt: {type:Date, default:Date.now},
  },
});


const makeid = function(){
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


const UserSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  billing: {
    type: String,
    required: true,
    trim: true
  },
  credit: {
    name: {type: String, default: ''},
    number: {type: String, default: ''},
  },
  userID: {
    type: String,
    default: makeid
  },
  pageID: Schema.Types.ObjectId,
  //upcoming: [UpcomingSchema],
});

// UpcomingSchema.post("save", function(next){
//   const upcoming = this;
//   if(upcoming.event.userID){
//     User.findById(upcoming.event.userID, function(err, user){
//       if(err || !up) return next(err);
//       user.upcoming.push()
//       next();
//     });
//   }
//   next();
// });

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          let err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}



UserSchema.pre("save", function(next){
  let user = this;
  if(user.password.length <= 16){
    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;

      next();
    })
  }
  else {
    next();
  }
});

const Upcoming = mongoose.model("Upcoming", UpcomingSchema);
//const UpcomingFile = mongoose.model("UpcomingFile", UpcomingFileSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
  Upcoming: Upcoming
};
