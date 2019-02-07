const express = require("express");

var router = express.Router();

const ActionModel = require("./../models/actions.js");
const logged = require("./../controllers/middleware/logged.js");

router.get("/all", logged, (req, res) => {
  ActionModel.find({
    userId: req.session.userId
  })
    .sort({ _id: -1 })
    .limit(5)
    .then(data => {
      res.json(data);
    })
    .catch(err => {});
});

router.post("/update", (req, resp) => {
  //Updates users.
});

module.exports = router;
