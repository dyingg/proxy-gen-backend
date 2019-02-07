var Tasks = require("../../models/tasks.js");
var Actions = require("../../models/actions.js");
var Stats = require("../../models/stats.js");
var Proxies = require("../../models/proxy");
var fork = require("child_process").fork;

var taskprocess = require("./taskProcess.js");

function create(req, res) {
  console.log(req.body);
  //Validate required
  if (
    req.body.taskName &&
    req.body.provider &&
    req.body.quantity &&
    req.body.authUserName &&
    req.body.authPassword &&
    req.body.location
  ) {
    if (isNaN(req.body.quantity)) {
      return;
    }
    var userId = req.session.userId;
    var payload = Object.assign({ userId }, req.body);
    var stat = new Stats({
      userId: userId,
      quantity: req.body.quantity
    });
    stat.save();
    var newTask = new Tasks(Object.assign(payload));

    newTask
      .save()
      .then(msg => {
        res.json({
          success: "Task has been accepted by the server",
          code: "900"
        });
        debugger;
        //Spawn a creator process with the stratergy for the required webhost
        //fork(__dirname + "/taskProcess.js", []);
        taskprocess(newTask._id, userId);
        //taskProcess(newTask._id, userId);
        //Creator process is expected to update the task data.
      })
      .catch(err => {
        console.log(err);
        return res.json({
          fail: "An error occured",
          code: "105"
        });
      });

    var createdAction = new Actions({
      userId,
      actionType: 1,
      actionMessage:
        "Created task " + payload.taskName + " for " + payload.provider
    });

    createdAction.save();

    //Activity Update
  }
}

module.exports = create;
