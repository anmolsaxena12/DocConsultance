const express = require('express')
const app = express.Router()
const {User, Doctor, Appointment} = require('./db/model')
const bcrypt = require("bcrypt");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/home.html");
  });
  
  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });
  
  app.post("/register", async function (req, res) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.pass, salt);
  
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
  
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("login.ejs");
      }
    });
  });
  
  app.get("/login", function (req, res) {
    // res.sendFile(__dirname + "/signin.html")
    res.render("login.ejs");
  });
  
  let aemail;
  let aid;
  app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email: email }, async function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          // console.log(foundUser.password);
          // console.log(password);
  
          if (await bcrypt.compare(password, foundUser.password)) {
            aemail = email;
  
            Doctor.find({}, function (err, foundDr) {
              if (foundDr.length === 0) {
                Doctor.insertMany(defaultItems, function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("added to db");
                  }
                });
                res.redirect("/doctors");
              } else {
                res.render("doc.ejs", { newListItems: foundDr });
              }
            });
          } else {
            // req.flash("error", "incorrect password");
            res.send('<script>alert("Incorrect Password!")</script>');
            res.redirect("/login");
          }
        } else {
          res.send('<script>alert("Invalid Credentials!")</script>');
          res.redirect("/login");
        }
      }
    });
  });
  app.get("/doctors", function (req, res) {
    Doctor.find({}, function (err, foundDr) {
      if (foundDr.length === 0) {
        Doctor.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("added to db");
          }
        });
        res.redirect("/doctors");
      } else {
        res.render("doc.ejs", {
          newListItems: foundDr,
        });
      }
    });
  });
  app.post("/doctors", function (req, res) {
    let searchItem = req.body.search;
  
    Doctor.find({ name: searchItem }, function (err, searchDr) {
      if (err) {
        console.log(err);
      } else {
        res.render("doc.ejs", { newListItems: searchDr });
      }
    });
  });
  app.get("/appointment", function (req, res) {
    res.sendFile(__dirname + "/app.html");
  });
  app.post("/appointment", function (req, res) {
    const newApp = new Appointment({
      // email: req.body.email,
      email: aemail,
      doctorID: req.body.docId,
      patientName: req.body.pName,
      contact: req.body.contact,
      date: req.body.date,
      time: req.body.time,
      status: "pending",
    });
    newApp.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendFile(__dirname + "/app.html");
      }
    });
  });
  
  app.get("/viewappointment", function (req, res) {
    Appointment.find({ email: aemail }, function (err, foundApp) {
      if (err) {
        console.log(err);
      } else {
        res.render("view.ejs", {
          apps: foundApp,
        });
      }
    });
  });
  
  app.post("/delete", function (req, res) {
    const deleteappId = req.body.deleteapp;
    Appointment.findByIdAndRemove(deleteappId, function (err) {
      if (!err) {
        console.log("appointment deleted");
        res.redirect("/viewappointment");
      }
    });
  });
  
  app.get("/doctorlogin", function (req, res) {
    // res.sendFile(__dirname + "/signin.html")
    res.render("doctorlogin.ejs");
  });
  app.post("/doctorlogin", function (req, res) {
    const doctorID = req.body.doctorID;
    const password = req.body.password;
    console.log(doctorID);
    aid = doctorID;
    // res.sendFile(__dirname + "/doctor-side.html")
    // res.redirect('/doctorside')
    Doctor.findOne({ doctorID: doctorID }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password == password) {
            res.redirect("/doctorside");
          } else {
            res.redirect("/doctorlogin");
          }
        }
      }
    });
  });
  app.get("/doctorside", function (req, res) {
    Appointment.find({ doctorID: aid }, function (err, foundApp) {
      if (err) {
        console.log(err);
      } else {
        res.render("doctor-side.ejs", { apps: foundApp });
      }
    });
    // res.render('doctor-side.ejs')
  });
  app.post("/docdeny", function (req, res) {
    const denyappId = req.body.denyapp;
    Appointment.findByIdAndUpdate(
      denyappId,
      {
        status: "denied",
      },
      function (err) {
        if (!err) {
          console.log("appointment deleted");
          res.redirect("/doctorside");
        }
      }
    );
  });
  app.post("/docapprove", function (req, res) {
    const approveappId = req.body.acceptapp;
    Appointment.findByIdAndUpdate(
      approveappId,
      {
        status: "approved",
      },
      function (err) {
        if (!err) {
          console.log("appointment approved");
          res.redirect("/doctorside");
        }
      }
    );
  });
  
  app.post("/", function (req, res) {
    res.redirect("/");
  });
  
  app.post("/login", function (req, res) {
    res.redirect("/");
  });
  
  app.post("/register", function (req, res) {
    res.redirect("/");
  });
  
  module.exports = app