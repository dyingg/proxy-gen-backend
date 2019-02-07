const express = require("express");

const ProviderStratergy = require("../stratergy/handle.js");
const logged = require("../middleware/logged.js");
const router = express.Router();
const Users = require("./../../models/users.js");

const getDatabseLongHand = require("./../middleware/dblonghand.js");
router.get("/:provider", logged, (req, res) => {
  var provider = req.params.provider;
  try {
    Users.findOne({
      _id: req.session.userId
    }).then(userData => {
      var dynamicProvider = new ProviderStratergy(provider);
      dynamicProvider.getRegions(resolve => {
        if (!resolve.error) {
          res.json(resolve.payload);
        } else {
          console.log("Error occured");
        }
      }, userData[getDatabseLongHand(provider)]);
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
