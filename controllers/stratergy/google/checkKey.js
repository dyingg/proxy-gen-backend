const Compute = require("@google-cloud/compute");

//If successful

//Resolve -> {success : true, data : body.name}
// Where body contains data that may help the user identify his key.

//Reject -> {success : false}

function checkKey(key) {
  //Aws Key is to be split by ;

  //First 0 => AcessKeyID
  //Second 1 => SecretAcessKey

  return new Promise(function(resolve, reject) {
    key = key.split(";");

    if (key.length != 3) {
      reject({ success: false });
      console.log("Length issue");
      return;
    }
    var projectId = key[0];
    var client_email = key[1];
    var private_key = key[2];

    console.log(key);
    const compute = new Compute({
      projectId,
      credentials: {
        client_email,
        private_key
      }
    });

    compute.getRegions({}, err => {
      if (err) {
        reject({ success: false });
      } else {
        console.log("No error");
        resolve({
          success: true,
          data: ""
        });
      }
    });
  });
}

module.exports = checkKey;

//success
//data
