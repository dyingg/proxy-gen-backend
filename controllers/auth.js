const express = require("express");

var router = express.Router();

const bodyParser = require("body-parser");

const path = require("path");
var Users = require("../models/users");

router.use(bodyParser.urlencoded());

router.post("/login", (req, res) => {
  if (req.session.userId) {
    return res.json({
      fail: "Already logged in",
      code: 100
    });
  }

  // 1.) Check if required fields are entered.
  console.log(req.body);
  if (req.body.key) {
    var key = req.body.key;
    Users.findOne({ siteKey: key })
      .then(data => {
        if (data) {
          //Valid key auth
          req.session.userId = data._id;
          res.redirect("/maker");
        } else {
          return res.json({
            fail: "Invalid Key provided",
            code: 100
          });
        }
      })
      .catch(err => {
        res.json({
          fail: "Invalid key provided",
          code: 100
        });
      });
  } else {
    return res.json({
      fail: "Key is a required field"
    });
  }
});

router.get("/createKey", (req, res) => {
  var acc = new Users({
    username: "Admin"
  });
  acc.save().then(data => {
    res.json(data);
  });
});

module.exports = router;
