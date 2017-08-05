const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const addressData = require('../../data/formData').addressData;
const defaultBilling = (Object.keys(addressData)).map((k) => addressData[k]["default"]).join('/');

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


const makeid = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
    default: 'email'
  },
  password: {
    type: String,
    trim: true
  },
  facebookID: {
    type: String
  },
  billing: {
    type: String,
    trim: true,
    default: defaultBilling
  },
  credit: {
    name: {type: String, default: ''},
    number: {type: String, default: ''},
  },
  userID: {
    type: String,
    default: makeid
  },
  pageID: Schema.Types.ObjectId
});



UserSchema.statics.authenticate = (email, password, next) => {

  if(!(!email) && !(!password)){
    User.findOne({ email: email })
        .exec(function (error, user) {
          if (error) {
            return next(error);
          }
          else if (!user) {
            let err = new Error('User not found.');
            err.status = 400;
            return next(err);
          }
          bcrypt.compare(password, user.password , function(error, result) {
            if (result === true){
              return next(null, user);
            }
            else {
              let err = new Error('Incorrect password for given email.');
              err.status = 401;
              return next(err);
            }
          })
        });
  }
  else {
    let err = new Error("*Fill out required fields.");
    err.status = 400;
    return next(err);
  }
}



UserSchema.pre("save", function(next){
  let user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  })
});

const Upcoming = mongoose.model("Upcoming", UpcomingSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
  Upcoming: Upcoming
};
