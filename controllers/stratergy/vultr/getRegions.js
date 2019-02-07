const request = require("request");

function getRegions(key) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.vultr.com/v1/regions/list?availability=yes",
        headers: {}
      },
      (err, resp, body) => {
        if (!err) {
          resolve(JSON.parse(body));
        } else {
          reject({
            error: "Error occured"
          });
        }
      }
    );
  });
}

module.exports = getRegions;
