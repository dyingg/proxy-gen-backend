const request = require("request");

function destroy(key, vpsID) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.digitalocean.com/v2/droplets/" + vpsID,
        headers: {
          Authorization: "Bearer " + key
        },
        method: "DELETE"
      },
      (err, resp, body) => {
        console.log(body);
        resolve();
      }
    );
  });
}

module.exports = destroy;
