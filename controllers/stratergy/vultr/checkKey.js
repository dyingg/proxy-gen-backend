const request = require("request");

function checkKey(key) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.vultr.com/v1/auth/info",
        headers: {
          "API-Key": key
        }
      },
      (err, resp, body) => {
        if (!err) {
          if (body == "Invalid API key") {
            reject({
              success: false
            });
          } else {
            try {
              body = JSON.parse(body);
              resolve({
                success: true,
                data: body.name
              });
            } catch (e) {
              console.log(e);
              reject({
                success: false
              });
            }
          }
        } else {
          console.log(err);
        }
      }
    );
  });
}

module.exports = checkKey;
