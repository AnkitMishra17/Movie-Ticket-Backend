const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timingSchema = new Schema({
  movieName: {
    type: String,
    required: [true],
  },
    timing:{
        type: String
    },
    available: {
      type: Number,
      min: 0,
      max: 20
    }
  });

const timings = mongoose.model("timing", timingSchema);
module.exports = timings;