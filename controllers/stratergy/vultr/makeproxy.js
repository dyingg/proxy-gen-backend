const request = require("request");
const makeScript = require("./createScript.js");

var polls = [];
function makeProxy(key, script) {
  return new Promise(function(resolve, reject) {
    var scriptID = script.id;
    var planID = 201;
    var locationID = script.loc || 1;

    let data = {
      DCID: locationID,
      VPSPLANID: planID,
      OSID: 167,
      SCRIPTID: scriptID
      // userdata: Buffer.from(userdata).toString('base64')
    };

    request(
      {
        url: "https://api.vultr.com/v1/server/create",
        headers: {
          "API-Key": key
        },
        method: "POST",
        formData: data
      },
      (err, resp, body) => {
        if (!err) {
          if (resp.statusCode == 200) {
            body = JSON.parse(body);
            var SUBID = body.SUBID;
            var pollId = polls.length;
            polls.push(setInterval(poll, 2000, key, SUBID, resolve, pollId));
          } else {
            //Message for error will be here.
            reject(body);
          }
        } else {
          console.log(err);
          reject("Vultr returned an error");
        }
      }
    );
  });
}

function poll(key, SUBID, resolve, pollId) {
  request(
    {
      url: "https://api.vultr.com/v1/server/list",
      headers: {
        "API-Key": key
      }
    },
    (err, res, body) => {
      if (res.statusCode == 200) {
        body = JSON.parse(body);
        var keys = Object.keys(body);
        if (keys.includes(SUBID) && body[SUBID].main_ip != "0.0.0.0") {
          //found update DB;
          clearInterval(polls[pollId]);
          var vps = body[SUBID];
          resolve({
            ip: vps.main_ip,
            vpsId: SUBID
          });

          //console
          console.log(vps.main_ip);
        }
      }
    }
  );
}

module.exports = makeProxy;
// makeProxy("26N4HF4DSB2QUFFZ7TNQQWTXCTHIJYULZTJQ", {});
