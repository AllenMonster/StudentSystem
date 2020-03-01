const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./api/db");
const router = require("./router");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("mongoDB conn");
});
if (!module.parent) {
  app.listen(4000, () => {
    console.log("succss: http://localhost:4000");
  });
} else {
  module.exports = app;
}
