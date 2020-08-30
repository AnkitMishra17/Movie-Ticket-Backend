const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

const app = express();

mongoose.connect(
  "mongodb://testuser:test123@ds217092.mlab.com:17092/ticket-booking",
  { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false },
  () => {
    console.log("Connection established");
  }
);

app.use(bodyParser.json());
const routes = require("./routes/api");

app.use("/api", routes);

app.listen(3000, () => {
  console.log("server started on port", port);
});
