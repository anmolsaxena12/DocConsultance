const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var flash = require("express-flash");
const app = express();

app.set("view-engine", "ejs");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(__dirname + "/public"));

// db connections
const connectDB = require("./db/connection");
// schemas
connectDB();

const { User, Doctor, Appointment } = require("./db/model");

// load routers
app.use("/", require("./router"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully on:", port);
});
