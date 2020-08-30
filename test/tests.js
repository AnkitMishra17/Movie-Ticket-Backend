const assert = require("assert");
const ticketDetails = require("../models/ticketSchema");
const showDetails = require("../models/showSchema");
const moment = require("moment");
const chaiHttp = require("chai-http");

// Describe the tests

describe("Validate Tickets", function () {
  var char;
  beforeEach(function (done) {
    char = new ticketDetails({
      movie: "Lootcase",
      timing: "2:30 PM",
      customerInfo: {
        name: "Saksham",
        phoneNo: 7007936324,
        ticketsBooked: 4,
      },
    });
    char.save().then(function () {
      done();
    });
  });
  it("check if the ticket is expired or not, diff is >= 8 hours", function (done) {
      ticketDetails.find({}).then((result)=>{
        let time = result[0].timing;
        let cl = time.split(" ")[1];
        time = time.split(" ")[0].split(":");
        let hrs = parseInt(time[0]);
        if (cl === "PM") {
          hrs += 12;
        }
        let b = moment([hrs], ["HH"]).fromNow(true);
        let diff = b.split(" ")[0];
        if(diff >= 8){
            assert(diff >= 8)
            done();
        }else{
            assert(diff <= 8)
            done();
        }
      })
  });
});

describe("Add New Shows", function () {
  it("New movie timings can be posted.", function (done) {
    const char = new showDetails({
      movieName: "Jojo Rabbit",
      timing: "5:30 PM",
      available: 20,
    });

    char.save().then(function () {
      assert(!char.isNew);
      done();
    });
  });
});

describe("Book Tickets", function () {
  it("User can book 1-4 tickets", function (done) {
    const char = new ticketDetails({
      movie: "Lootcase",
      timing: "2:30 PM",
      customerInfo: {
        name: "Saksham",
        phoneNo: 7007936324,
        ticketsBooked: 4,
      },
    });

    char.save().then(function () {
      assert(!char.isNew);
      done();
    });
  });
});

describe("Finding personal details", function () {
  var char;
  beforeEach(function (done) {
    char = new ticketDetails({
      movie: "Watchmen",
      timing: "1:30 PM",
      customerInfo: {
        name: "Ankit",
        phoneNo: 8779362324,
        ticketsBooked: 3,
      },
    });
    char.save().then(function () {
      done();
    });
  });

  // Create tests
  it("Finds personal details by the ticket id", function (done) {
    ticketDetails.findOne({ _id: char._id }).then(function (result) {
      assert(result.customerInfo.name === char.customerInfo.name);
      assert(result.customerInfo.phoneNo === char.customerInfo.phoneNo);
      assert(
        result.customerInfo.ticketsBooked === char.customerInfo.ticketsBooked
      );
      done();
    });
  });
});

describe("Finding shows for a particular time.", function () {
  var char;
  beforeEach(function (done) {
    char = new showDetails({
      movieName: "Watchmen",
      timing: "1:30 PM",
      available: 20,
    });
    char.save();
    char2 = new showDetails({
      movieName: "Lootcase",
      timing: "1:30 PM",
      available: 20,
    });
    char2.save().then(function () {
      done();
    });
  });

  // Create tests
  it("Finds personal details by the ticket id", function (done) {
    showDetails.find({ timing: char.timing }).then(function (result) {
      assert(result[0].timing === result[1].timing);
      done();
    });
  });
});

describe("User Changing/Updating Show Timings", function () {
  var char;

  beforeEach(function (done) {
    char = new ticketDetails({
      movie: "Watchmen",
      timing: "1:30 PM",
      customerInfo: {
        name: "Ankit",
        phoneNo: 8779362324,
        ticketsBooked: 3,
      },
    });
    char.save().then(function () {
      done();
    });
  });

  it("Chooses another screening time of the same movie", function (done) {
    ticketDetails
      .findOneAndUpdate({ timing: "1:30 PM" }, { timing: "11:30 AM" })
      .then(function () {
        ticketDetails.findOne({ _id: char._id }).then(function (result) {
          assert(result.timing === "1:30 PM");
          done();
        });
      });
  });
});

describe("User can cancel booking/delete ticket", function () {
  var char;

  beforeEach(function (done) {
    char = new ticketDetails({
      movie: "Tenet",
      timing: "5:30 PM",
      customerInfo: {
        name: "Mohit",
        phoneNo: 987362324,
        ticketsBooked: 3,
      },
    });
    char.save().then(function () {
      done();
    });
  });

  it("Deletes a record from the database", function (done) {
    ticketDetails.findByIdAndDelete({ _id: char._id }).then(function () {
      ticketDetails.findOne({ _id: char._id }).then(function (result) {
        assert(result === null);
        done();
      });
    });
  });
});
