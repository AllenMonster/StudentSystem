const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  desc: { type: String },
  status: { type: Number, default: 1 },
  avatar: { type: String, default: "" },
  detail: { type: String }
});

const StudentModel = mongoose.model("students", studentSchema);

module.exports = StudentModel;
