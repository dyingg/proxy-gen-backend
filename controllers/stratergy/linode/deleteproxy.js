const request = require("request");

function destroy(key, vpsID) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.linode.com/v4/linode/instances/" + vpsID,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + key
        }
      },
      (err, resp, body) => {
        if (resp.statusCode == 200);
        {
          resolve();
        }
      }
    );
  });
}

module.exports = destroy;
