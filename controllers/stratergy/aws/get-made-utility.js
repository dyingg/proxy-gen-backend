const aws = require("aws-sdk");
const base64 = require("base-64");
const uuid = require("uuid/v1");

var pollInterval = "";

var elapsed = 0;

//Script gives lov0222222222222222222
//Script gives id

function poll(key, uuid, region, username, password) {
  //Polls for ips
  var keyString = key.split(";");
  if (keyString.length !== 2) {
    return reject({
      error: "Split is messed"
    });
  }
  var ec2 = new aws.EC2({
    accessKeyId: keyString[0],
    secretAccessKey: keyString[1],
    region: region
  });
  ec2.describeInstances({}, (err, data) => {
    if (!err) {
      var publicIps = [];

      data.Reservations.forEach(reservation => {
        reservation.Instances.forEach(instance => {
          if (instance.Tags[0] && instance.Tags[0].Value == uuid) {
            console.log(
              instance.PublicIpAddress + ":3128:" + username + ":" + password
            );
          }
        });
      });

      // data.Reservations[0].Instances.forEach(instance => {
      //   publicIps.push(
      //     instance.PublicIpAddress + ":3128:" + username + ":" + password
      //   );
      // });
    } else {
      console.log(err);
    }
  });
}

poll(
  "AKIAI6VTE4ARAOCOB2IA;9N+nn3gqPyhuRSvsnw0JrnKgorqc9BUWmtVPDn/h",
  "062e9620-0890-11e9-bba8-f1b7e36a0e73",
  "us-east-1",
  "pleaseworkshopify",
  "12343124234"
);

///module.exports = makeProxy;
//username
//password
//loc
//qty

//resolves with keys corresponding to ips and uuid
