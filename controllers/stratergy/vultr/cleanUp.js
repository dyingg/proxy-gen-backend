const request = require("request");

function deleteScript(key, id) {
  return new Promise(function(resolve, reject) {
    var data = {
      SCRIPTID: id
    };
    resolve();
    setInterval(() => {
      request(
        {
          url: "https://api.vultr.com/v1/startupscript/destroy",
          headers: {
            "API-Key": key
          },
          method: "POST",
          formData: data
        },
        (err, resp, body) => {}
      );
    }, 2 * 60000);
  });
}
module.exports = deleteScript;
