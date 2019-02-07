const express = require("express");
var router = express.Router();

const allController = require("./tasks/all.js");
const createdController = require("./tasks/create.js");
const getProxiesController = require("./tasks/getProxies.js");
const logged = require("./middleware/logged.js");
const stats = require("./../models/stats.js");
const ProxyModel = require("./../models/proxy");
const TaskModel = require("./../models/tasks.js");

var deleteProcess = require("./tasks/deleteProcess.js");

const fork = require("child_process").fork;

router.get("/all", logged, allController);

router.get("/dashboard", logged, (req, res) => {
  pricing = {
    linode: 0.0075,
    digio: 0.007,
    vultr: 0.007,
    aws: 0.015
  };
  var totalPrice = 0;
  var totalRunning = 0;

  TaskModel.find({ userId: req.session.userId }).then(data => {
    data.forEach(tas => {
      totalRunning += tas.progressQuantity;
      totalPrice += pricing[tas.provider] * tas.progressQuantity;
    });
    stats
      .find({
        userId: req.session.userId
      })
      .then(mdata => {
        var foo = 0;
        mdata.forEach(data => {
          foo += data.quantity;
        });

        res.json({
          totalRunning,
          totalPrice,
          today: foo
        });
      });
  });
});

router.post("/create", logged, createdController);

router.get("/json/:id", logged, (req, res) => {
  var userID = req.session.userId;
  var taskId = req.params.id;
  if (taskId) {
    TaskModel.findOne({ _id: taskId })
      .then(data1 => {
        if (data1.userId == userID) {
          ProxyModel.find({
            taskId: taskId,
            active: true
          }).then(data => {
            res.json(data);
          });
        }
      })
      .catch(err => {
        res.json({ fail: "Task not found. May have been deleted." });
      });
  }
});

router.post("/delete", logged, (req, resp) => {
  var userID = req.session.userId;
  if (req.body.taskMap) {
    var taskIDs = Object.keys(req.body.taskMap);
    taskIDs.forEach(taskId => {
      // console.log("Deleting " + taskId);
      //fork(__dirname + "/tasks/deleteProcess.js", [userID, taskId]);
      deleteProcess(taskId, userID);
    });
  }
});

router.get("/:id", logged, (req, res) => {
  var userID = req.session.userId;
  var taskId = req.params.id;
  if (taskId) {
    TaskModel.findOne({ _id: taskId })
      .then(data1 => {
        if (data1.userId == userID) {
          ProxyModel.find({
            taskId: taskId
          }).then(data => {
            var dataString = "";
            data.forEach(pp => {
              dataString += pp.proxyString + "\r\n";
            });
            res.setHeader("Content-type", "application/octet-stream");

            res.setHeader(
              "Content-disposition",
              "attachment; filename=" + data1.taskName + ".txt"
            );

            res.send(dataString);
          });
        }
      })
      .catch(err => {
        res.json({ fail: "Task not found. May have been deleted." });
      });
  }
});

//Get all proxies from a task

//Spec
//Returns all proxies for a task id
router.get("/proxies/:id", logged, getProxiesController);
module.exports = router;
