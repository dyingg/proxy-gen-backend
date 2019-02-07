const request = require("request");

//If successful

//Resolve -> {success : true, data : body.name}
// Where body contains data that may help the user identify his key.

//Reject -> {success : false}

function checkKey(key) {
  //Aws Key is to be split by ;

  //First 0 => AcessKeyID
  //Second 1 => SecretAcessKey

  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.linode.com/v4/account",
        headers: {
          Authorization: "Bearer " + key
        }
      },
      (err, resp, body) => {
        if (resp.statusCode == 200) {
          body = JSON.parse(body);
          resolve({
            success: true,
            data: body.first_name
          });
        } else {
          reject({
            success: false
          });
        }
      }
    );
  });
}

module.exports = checkKey;

//success
//data
