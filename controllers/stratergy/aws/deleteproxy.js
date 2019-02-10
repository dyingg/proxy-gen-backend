const aws = require("aws-sdk");

function destroy(key, vpsID, loc) {
  return new Promise(function(resolve, reject) {
    var keyString = key.split(";");
    if (keyString.length !== 2) {
      return reject({
        error: "Split is messed"
      });
    }
    console.log(key);
    console.log("." + loc + ".");
    console.log(vpsID);
    var ec2 = new aws.EC2({
      accessKeyId: keyString[0],
      secretAccessKey: keyString[1],
      region: loc
    });

    ec2.describeInstances({}, (err, data) => {
      if (!err) {
        console.log(data);
        var publicIps = {};
        console.log("Finding");
        data.Reservations.forEach(reservation => {
          reservation.Instances.forEach(inst => {
            if (inst.Tags[0].Value == vpsID) {
              publicIps[inst.InstanceId] = { found: true };
            }
          });
        });

        console.log(publicIps);

        ec2.terminateInstances(
          {
            InstanceIds: Object.keys(publicIps)
          },
          (err, data) => {
            if (!err) {
              console.log(data);
              resolve();
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    });
  });
}

module.exports = destroy;
