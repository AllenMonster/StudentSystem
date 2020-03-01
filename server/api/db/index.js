const mongoose = require("mongoose");
// docker调试 "mongodb://mongo:27017/students_server"
// 本地调试调试 "mongodb://localhost:27017/students_server"
mongoose.connect("mongodb://mongo:27017/students_server", {
  useNewUrlParser: true
});
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;

module.exports = db;
