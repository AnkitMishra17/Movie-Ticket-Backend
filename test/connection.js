const mongoose = require('mongoose');
const moment = require("moment");

mongoose.Promise = global.Promise;

var mongoDB = "mongodb://testuser:test123@ds217092.mlab.com:17092/ticket-booking";

before(function(done) {
  mongoose.connect(mongoDB,{
    useFindAndModify: false
  });
  var db = mongoose.connection;
  db.once('open', function() {
    console.log('Connection Established...');
    done();
  }).on('error', function(error) {
    console.error('Connection Error:' + error);
  });
});
