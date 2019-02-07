const request = require("request");

function getRegions(key) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.linode.com/v4/regions",
        headers: {}
      },
      (err, resp, body) => {
        if (resp.statusCode == 200) {
          body = JSON.parse(body);
          var regionlist = {};
          body.data.forEach(region => {
            regionlist[region.id] = {
              name: region.id
            };
          });

          resolve(regionlist);
        }
      }
    );
  });
}

module.exports = getRegions;
