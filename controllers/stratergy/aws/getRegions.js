const request = require("request");

const aws = require("aws-sdk");

function getRegions(key) {
  return new Promise(function(resolve, reject) {
    console.log(key);

    var keyString = key.split(";");
    if (keyString.length !== 2) {
      return reject({
        error: "Split is fucked"
      });
    }
    var ec2 = new aws.EC2({
      accessKeyId: keyString[0],
      secretAccessKey: keyString[1],
      region: "us-west-2"
    });

    ec2.describeRegions({}, (err, data) => {
      if (err) {
        return reject({ error: "Key error" });
      } else {
        console.log(data);
        var payload = {};
        data.Regions.forEach(region => {
          payload[region.RegionName] = { name: region.RegionName };
        });
        resolve(payload);
      }
    });
  });
}

module.exports = getRegions;
