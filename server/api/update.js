const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pathDir = path.join(__dirname, "..", "public/upload");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!fs.existsSync(pathDir)) {
      fs.mkdir(pathDir, err => {
        if (err) {
          console.log(err);
        } else {
          cb(null, pathDir);
        }
      });
    } else {
      cb(null, pathDir);
    }
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage });
const uploadSingle = upload.single("image");

module.exports = function fileUpload(Router) {
  Router.post("/student/upload", (req, res) => {
    uploadSingle(req, res, function(err) {
      if (err) {
        return res.send(500, { status: 1, msg: "上传失败" });
      }
      var file = req.file;
      res.send({
        status: 0,
        data: {
          name: file.filename,
          url: "http://localhost:4000/upload/" + file.filename
        }
      });
    });
  });
};
