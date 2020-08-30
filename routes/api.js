const express = require("express");
const moment = require("moment");
const router = express.Router();
const tickets = require("../models/ticketSchema");
const timings = require("../models/showSchema");

router.get("/validatetickets", (req, res) => {
  tickets.find({}).then((data) => {
    data.forEach(function (message) {
      let time = message.timing;
      let ticketbooked = message.customerInfo.ticketsBooked;
      let query = { movieName: message.movie, timing: message.timing };
      let cl = time.split(" ")[1];
      time = time.split(" ")[0].split(":");
      let hrs = parseInt(time[0]);
      if (cl === "PM") {
        hrs += 12;
      }
      let b = moment([hrs], ["HH"]).fromNow(true);
      let diff = b.split(" ")[0];
      if (diff >= 8) {
        tickets.find({ _id: message._id }).then(() => {
          tickets
            .findByIdAndUpdate({ _id: message._id }, { expired: true })
            .then(() => {
              tickets.findOneAndDelete({ expired: true }).then((data) => {
                res.send({
                  message: `Following ticket has been expired and now deleted`,
                  data,
                });
                timings.find(query).then((data) => {
                  let updateticketcount = data[0].available;
                  let sum = updateticketcount + ticketbooked;
                  timings
                    .findOneAndUpdate(query, {
                      available: sum,
                    })
                    .then((dat) => {
                      console.log(dat);
                    });
                });
              });
            });
        });
      }
    });
  });
});

router.get("/bookingdetails/:id", (req, res) => {
  tickets.findById({ _id: req.params.id }).then((data) => {
    res.send(data.customerInfo);
  });
});

router.get("/viewshows/:time", (req, res) => {
  timings.find({ timing: req.params.time }).then((data) => {
    res.send(data);
  });
});

router.post("/addshows", (req, res) => {
  timings.create(req.body).then((data) => {
    res.send(data);
  });
});

router.post("/bookticket", (req, res) => {
  let query = { movieName: req.body.movie, timing: req.body.timing };
  timings.find(query).then((movieDetails) => {
    if (movieDetails.length > 0) {
      let ticksLeft =
        movieDetails[0].available - req.body.customerInfo.ticketsBooked;
      if (ticksLeft >= 0) {
        tickets
          .create(req.body)
          .then((data) => {
            res.send(data);
          })
          .then(() => {
            timings
              .findOneAndUpdate(query, { available: ticksLeft })
              .then((data) => {
                timings.findOne(query).then((data) => {
                  console.log(data);
                });
              });
          });
      } else {
        res.send({
          response: "Sorry, this slot is full!",
        });
      }
    } else {
      res.send({
        response: "Time slot or movie name is incorrect",
      });
    }
  });
});

router.put("/updatebooking/:id", (req, res) => {
  tickets.findByIdAndUpdate({ _id: req.params.id }, req.body).then((data) => {
    let ticketbooked = data.customerInfo.ticketsBooked;
    let movie = data.movie;
    let time = data.timing;
    let query = { movieName: movie, timing: req.body.timing };
    let query2 = { movieName: movie, timing: time };
    timings.exists(query).then((status) => {
      if (status) {
        timings.findOne(query).then((data) => {
          let remaining = data.available;
          timings
            .findOneAndUpdate(query, { available: remaining - ticketbooked })
            .then(() => {
              timings.find(query2).then((data) => {
                let updateticketcount = data[0].available;
                timings
                  .findOneAndUpdate(query2, {
                    available: updateticketcount + ticketbooked,
                  })
                  .then((load) => {
                    tickets.findById({ _id: req.params.id }).then((data) => {
                      res.send({
                        message: `Booking slot successfully changed to ${req.body.timing}`,
                        data,
                      });
                    });
                  });
              });
            });
        });
      } else {
        res.send({
          response: "The slot is not available for the movie you've chosen",
        });
      }
    });
  });
});

router.delete("/cancelbooking/:id", (req, res) => {
  tickets.findByIdAndDelete({ _id: req.params.id }).then((data) => {
    res.send({ message: "Booking successfully cancelled", data });
    let ticketbooked = data.customerInfo.ticketsBooked;
    let query = { movieName: data.movie, timing: data.timing };
    timings.findOne(query).then((data) => {
      let remaining = data.available;
      timings.findOneAndUpdate(query, {
        available: remaining + ticketbooked,
      });
    });
  });
});

module.exports = router;
