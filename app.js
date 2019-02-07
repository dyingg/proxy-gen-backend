var cluster = require("cluster");

if (cluster.isMaster) {
  var cpuCount = require("os").cpus().length;

  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  require("dotenv").config();
  var session = require("express-session");
  var bodyParser = require("body-parser");

  const TasksRouter = require("./controllers/tasks");
  const AuthRouter = require("./controllers/auth");
  const ProfileRouter = require("./controllers/profile/profile.js");
  const ActionRouter = require("./controllers/actions.js");
  const RegionRouter = require("./controllers/regions/region.js");
  const express = require("express");

  const app = express();
var RedisStore = require('connect-mongo')(session); 
 const mongoose = require("mongoose");
  mongoose
    .connect(
      process.env.MONGO,
      { useNewUrlParser: true }
    )
    .then(() => console.log("Connected to database!"))
    .catch(err => {
      console.log(err);
    });
  app.use(bodyParser.json());
  app.use(
    session({

store: new RedisStore({
     mongooseConnection: mongoose.connection 
  }),
      secret: "keyboarddcat",
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );

  app.use(express.static("public"));

  app.use(function cros(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use("/tasks", TasksRouter);
  app.use("/auth", AuthRouter);
  app.use("/profile", ProfileRouter);
  app.use("/actions", ActionRouter);
  app.use("/regions", RegionRouter);

  app.get("/", (req, res) => {
    if (req.session.userId) {
      //Send the ReactJSX admin panel.
      res.redirect("/maker");
    } else {
      //Send Key page
      res.sendFile(__dirname + "/views/index.html");
    }
  });

  app.get("/maker/", (req, res) => {
    if (req.session.userId) {
      res.sendFile(__dirname + "/views/suite/index.html");
    }
  });

  app.get("/maker/*", (req, res) => {
    if (req.session.userId) {
      res.sendFile(__dirname + "/views/suite/index.html");
    }
  });

  app.get("/health", (req, res) => {
    res.json({ running: true });
  });

  app.get("*", (req, res) => {
    if (req.session.userId) {
      res.sendFile(__dirname + "/views/suite/index.html");
    } else {
      res.redirect("/");
    }
  });

  app.listen(80);
  console.log("Running", cluster.worker.id);
}
