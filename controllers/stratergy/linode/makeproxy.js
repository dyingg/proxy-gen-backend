const request = require("request");
const makeScript = require("./createScript.js");

var polls = [];
function makeProxy(key, script) {
  console.log(key);
  console.log(script);

  return new Promise(function(resolve, reject) {
    var createInstance = {
      type: "g6-nanode-1",
      region: script.loc,
      image: "linode/centos7",
      root_pass: "Password1234owejwo",
      stackscript_id: 376530,
      stackscript_data: {
        PROXY_USER: script.username,
        PROXY_PASS: script.password
      }
    };
    //www.linode.com/stackscripts/index
    //api.linode.com/v4/linode/instances

    console.log("Started to create a proxy with the given config");

    request(
      {
        url: "https://api.linode.com/v4/linode/instances",
        json: createInstance,
        method: "POST",
        headers: {
          Authorization: "Bearer " + key
        }
      },
      (err, resp, body) => {
        if (resp.statusCode == 200) {
          resolve({
            ip: body.ipv4[0],
            vpsId: body.id
          });
        } else {
          reject();
        }
      }
    );
  });
}

// makeProxy("c3e3178d7a28de219723cc429da9d3cd26745702afe19c6319a8f97920c69884", {
//   username: "root",
//   password: "password",
//   loc: "us-west"
// })
//   .then(data => console.log(data))
//   .catch(err => {
//     console.log(err);
//   });
module.exports = makeProxy;
// makeProxy("26N4HF4DSB2QUFFZ7TNQQWTXCTHIJYULZTJQ", {});

//resolve
//ip
//vpsId
