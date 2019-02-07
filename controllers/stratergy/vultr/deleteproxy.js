const request = require("request");

function destroy(key, vpsID) {
  return new Promise(function(resolve, reject) {
    var data = {
      SUBID: vpsID
    };
    request(
      {
        url: "https://api.vultr.com/v1/server/destroy",
        headers: {
          "API-Key": key
        },
        method: "POST",
        formData: data
      },
      (err, resp, body) => {
        console.log(body);
        resolve();
      }
    );
  });
}

module.exports = destroy;
