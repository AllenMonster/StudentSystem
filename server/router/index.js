const express = require("express");
const StudentModel = require("../model/studentModel");
const pageFilter = require("../api/pageFilter");

const Router = express.Router();

Router.post("/student/add", (req, res) => {
  const student = req.body;
  StudentModel.create(student, (error, student) => {
    if (error) {
      console.error("新增学生错误格式", error);
      res.send(500, { status: 1, msg: "新增学生错误格式" });
    } else {
      res.send({ status: 0, data: student });
    }
  });
});

Router.get("/student/list", (req, res) => {
  const { pageNum, pageSize, status, name } = req.query;

  let contition = {};
  if (name) {
    contition.name = new RegExp(`^.*${name}.*$`);
  }
  if (status) {
    contition.status = status || "";
  }
  StudentModel.find(contition).exec((error, student) => {
    if (error) {
      console.error("查询学生列表错误", error);
      res.send(500, { status: 1, msg: "查询学生列表错误" });
    } else {
      if (student) {
        res.send({ status: 0, data: pageFilter(student, pageNum, pageSize) });
      }
    }
  });
});

Router.post("/student/update", (req, res) => {
  const student = req.body;
  StudentModel.findOneAndUpdate({ _id: student._id }, student).exec(
    (error, oldStudent) => {
      if (error) {
        console.error("更新学生信息格式错误", error);
        res.send(500, {
          status: 1,
          msg: "更新学生信息格式错误, 请稍后重试"
        });
      } else {
        res.send({ status: 0 });
      }
    }
  );
});
Router.delete("/student/delete", (req, res) => {
  const student = req.body;
  StudentModel.deleteOne({ _id: student._id }).exec(error => {
    if (error) {
      console.error("删除学生失败", error);
      res.send(500, {
        status: 1,
        msg: "删除学生失败, 请稍后重试"
      });
    } else {
      res.send({ status: 0 });
    }
  });
});
Router.get("/student/detail", (req, res) => {
  const { _id } = req.query;
  StudentModel.findOne({ _id }).exec((error, student) => {
    if (error) {
      console.error("获取学生详情失败", error);
      res.send(500, {
        status: 1,
        msg: "获取学生详情失败, 请稍后重试"
      });
    } else {
      res.send({ status: 0, data: student });
    }
  });
});
require("../api/update.js")(Router);
module.exports = Router;
