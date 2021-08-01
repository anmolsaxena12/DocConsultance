const mongoose = require("mongoose");

const userSchema = {
    name: String,
    email: String,
    password: String,
  };
  const doctorSchema = new mongoose.Schema({
    doctorID: Number,
    name: String,
    experience: String,
    specialization: String,
    degree: String,
    address: String,
    phoneNo: Number,
    fees: Number,
    openDays: String,
    openTime: String,
    password: Number,
  });
  const appointmentSchema = new mongoose.Schema({
    email: String,
    doctorID: Number,
    patientName: String,
    contact: Number,
    date: Date,
    time: String,
    status: String,
  });
  
  // models
  const User = mongoose.model("User", userSchema);
  const Doctor = mongoose.model("Doctor", doctorSchema);
  const Appointment = mongoose.model("Appointment", appointmentSchema);
  
  module.exports = {User, Doctor, Appointment};