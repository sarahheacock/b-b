const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const d = new Date();

const FreeSchema = new Schema({
  roomID: Schema.Types.ObjectId,
  reserved: {type: Number, default: 0}
});

const AvailableSchema = new Schema({
  pageID: Schema.Types.ObjectId,
  date: {type: Date, default: d.setHours(10)},
  free: {type: [FreeSchema], default: [FreeSchema]}
});

AvailableSchema.pre('save', function(next){
  this.free.sort(function(a, b){
    return a.roomID - b.roomID;
  });
  next();
});

AvailableSchema.statics.updateDates = function(req, callback) {
  const end = parseInt(req.end) - (24*60*60*1000);
  const begin = parseInt(req.start);

  let dateArr = [];
  let results = [];

  while(end >= begin){
    dateArr.push(new Date(end));
    end = end - (24*60*60*1000);
  }

  if(end < begin){

    dateArr.forEach(function(thisDate, dindex){
      const id = (req.user) ? req.user.pageID : req.page._id;

      Available.findOne({ pageID: id, date: thisDate }, function(err, date){

        if(err || !date) return next(err);
        date.free.forEach(function(d, index){
          if(d.roomID.equals(req.roomID)){
            if(req.dir){
              d.reserved += 1;
            }
            else {
              d.reserved -= 1;
            }

            if(date.free.length === index + 1 && dateArr.length === dindex + 1){
              date.save(callback);
            }
          }
          else if(date.free.length === index + 1 && dateArr.length === dindex + 1){
            date.save(callback);
          }
        });

      });
    });
  }
}





const Available = mongoose.model("Available", AvailableSchema);

module.exports.Available = Available;
