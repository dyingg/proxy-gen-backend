const Compute = require("@google-cloud/compute");

function destroy(key, vpsID) {
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

    compute.getVMs(function(err, vms) {
      vms.forEach(vm => {
        if (vm.id == vpsID) {
          console.log("Deleting " + vm.id);
          vm.delete().then(() => {
            resolve();
          });
        }
      });
    });
  });
}

module.exports = destroy;
