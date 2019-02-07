const express = require("express");

var router = express.Router();
const logged = require("../middleware/logged.js");
const UsersModel = require("../../models/users");
const ProviderStratergy = require("../stratergy/handle.js");

router.get("/display", logged, (req, res) => {
  var userId = req.session.userId;
  UsersModel.find({ _id: userId })
    .then(data => {
      if (data) {
        return res.json(data);
      } else {
        res.json({
          fail: "No key",
          code: 102
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({
        fail: "No key",
        code: 102
      });
    });
});

router.post("/update", logged, (req, res) => {
  var userId = req.session.userId;
  //First check

  UsersModel.findOne({ _id: userId })
    .then(data => {
      if (data) {
        //Spawn a key check process.
        console.log(req.body);
        console.log(data.vultrKey);

        if (data.digitalOceanKey != req.body.digitalOceanKey) {
          var digio = new ProviderStratergy(
            "digio",
            req.body.digitalOceanKey,
            userId
          );
          digio.checkKey();
        }

        if (data.googleKey != req.body.googleKey) {
          var private_key = req.body.googleKey;
          var parsedPrivateKey = private_key.split("\\n").join("\n");

          req.body.googleKey = parsedPrivateKey;
          console.log(req.body.googleKey);
          var google = new ProviderStratergy(
            "google",
            req.body.googleKey,
            userId
          );
          google.checkKey();
        }

        if (data.linodeKey != req.body.linodeKey) {
          var linode = new ProviderStratergy(
            "linode",
            req.body.linodeKey,
            userId
          );
          linode.checkKey();
        }
        //Key inits and checks.
        if (data.vultrKey != req.body.vultrKey) {
          var vultr = new ProviderStratergy("vultr", req.body.vultrKey, userId);
          vultr.checkKey();
        }

        if (data.awsKey != req.body.awsKey) {
          console.log("Checking");
          var aws = new ProviderStratergy("aws", req.body.awsKey, userId);
          aws.checkKey();
        }

        data.digitalOceanKey = req.body.digitalOceanKey;
        data.linodeKey = req.body.linodeKey;
        data.vultrKey = req.body.vultrKey;
        data.awsKey = req.body.awsKey;
        data.googleKey = req.body.googleKey;

        data
          .save()
          .then(() => {
            res.json({
              error: false,
              message: "User found!"
            });
          })
          .catch(err => {
            console.log(err);
            res.json({
              error: true,
              message: "An error occured!"
            });
          });
      } else {
        return res.json({
          error: true,
          message: "No user found with key"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({
        error: true,
        message: "Query failed"
      });
    });
});

module.exports = router;
