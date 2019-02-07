const vultrStratergy = require("./vultr/stratergyMap.js");
const awsStratergy = require("./aws/stratergyMap.js");
const digioStratergy = require("./digio/stratergyMap.js");
const linodeStratergy = require("./linode/stratergyMap.js");
const googleStratergy = require("./google/stratergyMap.js");

const ActionModel = require("./../../models/actions.js");
const TasksModel = require("./../../models/tasks.js");
const ProxyModel = require("./../../models/proxy.js");

function getRelevantStratergy(type) {
  switch (type) {
    case "vultr":
      return vultrStratergy;
    case "aws":
      return awsStratergy;
    case "digio":
      return digioStratergy;
    case "linode":
      return linodeStratergy;
    case "google":
      return googleStratergy;
    default:
      return null;
  }
}

class Provider {
  constructor(type, key, userId) {
    this.reqeuest = 0;
    this.progress = 0;
    this.type = type;
    this.key = key || "";
    this.userId = userId || "";
    this.stratergy = getRelevantStratergy(type);
    if (!this.stratergy) {
      throw { error: "No such stratergy" };
    }
  }

  setLocation(location) {
    this.location = location;
  }

  getRegions(cb, key) {
    this.stratergy
      .getRegions(key)
      .then(data => {
        cb({ error: false, payload: data });
      })
      .catch(err => {
        console.log("An error occured");
        cb({ error: true });
      });
  }

  checkKey() {
    this.stratergy
      .checkKey(this.key)
      .then(check => {
        var update = "";

        update = new ActionModel({
          userId: this.userId,
          actionType: 2,
          actionMessage:
            "New key updated for " +
            this.type +
            "! Account in use " +
            check.data
        });

        // } else {
        //   update = new ActionModel({
        //     userId: this.userId,
        //     actionType: 3,
        //     actionMessage: "Invalid key for " + this.type
        //   });
        // }
        update
          .save()
          .then(console.log)
          .catch(err => console.log(err));
      })
      .catch(err => {
        console.log("Yes its me");
        console.log(err);
        debugger;
        var update = new ActionModel({
          userId: this.userId,
          actionType: 3,
          actionMessage: "Invalid key for " + this.type
        });
        update.save(console.log);
      });
  }

  destroy(vpsID, key) {
    var apiKey = key || this.key;
    console.log("Destory");
    console.log(vpsID);
    console.log(apiKey);

    return this.stratergy.destory(apiKey, vpsID);
  }

  isMulti() {
    if (this.stratergy.multi) {
      return true;
    } else {
      return false;
    }
  }

  multiMakeProxy(username, password, loc, qty) {
    if (this.stratergy.multi) {
      return this.stratergy.makeProxy(this.key, {
        username,
        password,
        loc,
        qty
      });
    }
  }

  startup(username, password) {
    var strat = this.stratergy;
    var key = this.key;
    var self = this;
    return new Promise(function(resolve, reject) {
      strat
        .startUp(key, { username, password })
        .then(data => {
          self.script = data.id || 0;
          resolve();
        })
        .catch(() => reject());
    });
  }
  cleanup() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.stratergy.cleanUp(self.key, self.script).then(resolve());
    });
  }

  multiDelete(uid, loc) {
    if (this.stratergy.multi) {
      var self = this;
      return new Promise(function(res, rej) {
        self.stratergy.destory(self.key, uid, loc).then(() => {
          res();
        });
      });
    }
  }

  makeProxy(authUsername, authPassword, taskObject) {
    var self = this;
    var location = this.location;
    var mainStrat = this.stratergy;
    var userKey = this.key;

    return new Promise(function(resolve, reject) {
      mainStrat
        .makeProxy(userKey, {
          username: authUsername,
          password: authPassword,
          loc: location,
          id: self.script
        })
        .then(data => {
          var newProxy = new ProxyModel({
            proxyString:
              data.ip + ":" + "3128" + ":" + authUsername + ":" + authPassword,
            keyUsed: userKey,
            taskId: taskObject._id,
            taskName: taskObject.taskName,
            vpsId: data.vpsId,
            provider: taskObject.provider,
            location: taskObject.location,
            created: true,
            active: true,
            failed: false
          });
          newProxy.save();
          self.progress++;
          TasksModel.findOne({ _id: taskObject._id }).then(foundObject => {
            //console.log(foundObject);

            foundObject.progressQuantity = self.progress;

            foundObject.save().then(data => {
              //console.log(data);
              resolve(
                data.ip + ":" + "3128" + ":" + authUsername + ":" + authPassword
              );
            });
          });
        })
        .catch(err => {
          reject(err);
          console.log(err);
          console.log("Rejected");
          //Make a reject update to DB ? keep mainthread clean :(
        });
    });
  }
}

module.exports = Provider;
