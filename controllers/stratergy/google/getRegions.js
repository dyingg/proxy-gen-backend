const Compute = require("@google-cloud/compute");

function getRegions(key) {
  return new Promise(function(resolve, reject) {
    key = key.split(";");

    var projectId = key[0];
    var client_email = key[1];
    var private_key = key[2];

    const compute = new Compute({
      projectId,
      credentials: {
        client_email,
        private_key
      }
    });
    compute.getZones(function(err, zones) {
      if (!err) {
        var regions = {};
        zones.forEach(zone => {
          regions[zone.metadata.name] = { name: zone.metadata.name };
        });
        resolve(regions);
        console.log(regions);
      }
    });
  });
}

//getRegions();
//getRegions();
//Resolves  id : {name:""}
module.exports = getRegions;
