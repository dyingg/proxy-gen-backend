const request = require("request");

var AWS = require("aws-sdk");

//If successful

//Resolve -> {success : true, data : body.name}
// Where body contains data that may help the user identify his key.

//Reject -> {success : false}

function checkKey(key) {
  //Aws Key is to be split by ;

  //First 0 => AcessKeyID
  //Second 1 => SecretAcessKey

  return new Promise(function(resolve, reject) {
    var keyString = key.split(";");
    if (keyString.length != 2) {
      debugger;

      reject({
        success: false
      });
      return;
    }
    var ec2 = new AWS.EC2({
      accessKeyId: keyString[0],
      secretAccessKey: keyString[1],
      region: "us-west-2"
    });

    ec2.describeVpcs({}, (err, data) => {
      if (err) {
        reject({ success: false });
      } else {
        resolve({
          success: true,
          data: keyString[0]
        });
      }
    });
  });
}

module.exports = checkKey;
