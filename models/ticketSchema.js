const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  movie: {
    type: String,
    required: [true, "Please select a movie"],
  },
  timing:{
    type: String,
    required:[true]
  },
  expired: {
    type: Boolean,
    default: false
  },
  customerInfo:{
      name:{
          type: String,
          required:[true, 'Please enter your name']
      },
      phoneNo:{
          type: Number,
          required:[true, 'Phone number is mandatory']
      },
      ticketsBooked:{
        type: Number,
        min: 1,
        max: 4,
        required:[true]
      }
  }
});

const tickets = mongoose.model("ticket", ticketSchema);
module.exports = tickets;