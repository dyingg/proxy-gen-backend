const request = require("request");

//Resolve follows vultr's way of sending regions it seems

function getRegions(key) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.digitalocean.com/v2/sizes",
        headers: {
          Authorization: "Bearer " + key
        }
      },
      (err, resp, body) => {
        if (resp.statusCode == 200) {
          body = JSON.parse(body);
          var payload = {};
          body.sizes[0].regions.forEach(region => {
            payload[region] = {
              name: region
            };
          });
          console.log(payload);
          resolve(payload);
        } else {
          reject({ error: "Error occured" });
        }
      }
    );
  });
}

module.exports = getRegions;
