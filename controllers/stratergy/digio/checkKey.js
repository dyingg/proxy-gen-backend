const request = require("request");

//If successful

//Resolve -> {success : true, data : body.name}
// Where body contains data that may help the user identify his key.

//Reject -> {success : false}

function checkKey(key) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.digitalocean.com/v2/account",
        headers: {
          Authorization: "Bearer " + key
        }
      },
      (err, resp, body) => {
        if (resp.statusCode == 200) {
          body = JSON.parse(body);
          resolve({
            success: true,
            data: body.account.email
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

//checkKey("e399797520e82205a4e278ea501a8f89378b0db5288718bc615f0d7738bd7716");
module.exports = checkKey;
