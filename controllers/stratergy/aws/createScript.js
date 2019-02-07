const aws = require("aws-sdk");

function createScript(key, auth) {
  return new Promise(function(resolve, reject) {
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

    ec2.describeSecurityGroups({}, (err, data) => {
      data.SecurityGroups.forEach(group => {
        if (group.GroupName == "default") {
          //Bang
          resolve({
            id: group.GroupId + ";" + group.VpcId
          });
        }
      });
    });
  });
}

createScript("AKIAJ6K575PCFEQZN2CQ;RXjCjkXX0NhFKiisFSp8i3rVY3GVqQiyB0ot9viu");

module.exports = createScript;

//Resolve with
//id
//loc

//reject with err
