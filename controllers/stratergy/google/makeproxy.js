var Compute = require("@google-cloud/compute");
/**
 *  resolve({
 *    ip,
 *    vpsId
 * })
 */

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

/**
 *  script.username
 *  script.password
 *  script.loc
 */

function makeProxy(key, script) {
  console.log(key);
  console.log(script);

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
    compute.createFirewall(
      "proxy1",
      {
        protocols: {
          tcp: "3128"
        },
        ranges: ["0.0.0.0/0"]
      },
      (err, firewall) => {
        if (err) {
          // console.log(err);
        }
        // console.log(firewall);
      }
    );

    const zone = compute.zone(script.loc);

    var vmName = "as"+guid().toLowerCase();
    zone
      .createVM(vmName, {
        machineType:"g1-small",  //"n1-standard-1",
        os: "centos",
        networkInterfaces: [
          {
            kind: "compute#networkInterface",
            accessConfigs: [
              {
                kind: "compute#accessConfig",
                name: "External NAT",
                type: "ONE_TO_ONE_NAT",
                networkTier: "PREMIUM"
              }
            ],
            aliasIpRanges: []
          }
        ],
        metadata: {
          items: [
            {
              key: "startup-script",
              value:
                "#!/bin/bash \n" +
                "yum install squid wget httpd-tools -y &&" +
                "touch /etc/squid/passwd &&" +
                "htpasswd -b /etc/squid/passwd " +
                script.username +
                " " +
                script.password +
                " &&" +
                "wget -O /etc/squid/squid.conf http://140.82.4.135/squid.conf --no-check-certificate &&" +
                "touch /etc/squid/blacklist.acl &&" +
                "systemctl restart squid.service && systemctl enable squid.service &&" +
                "iptables -I INPUT -p tcp --dport 3128 -j ACCEPT &&" +
                "iptables-save"
            }
          ]
        }
      })
      .then(data => {
        var operation = data[1];

        operation
          .on("error", function(err) {
            console.log(err);
            reject("Error");
          })
          .on("running", function(metadata) {
            //console.log(metadata);
          })
          .on("complete", function(metadata) {
            debugger;
            zone.getVMs({}, function(err, vm) {
              if (!err) {
                vm.forEach(function(inst) {
                  //...
                  if (inst.id == vmName) {
                    resolve({
                      ip:
                        inst.metadata.networkInterfaces[0].accessConfigs[0]
                          .natIP,
                      vpsId: vmName
                    });
                  }
                });
              } else {
                // console.log(err);
              }
            });
          });
      })
      .catch(err => {
        // reject(err.errors[0].message);
        console.log(err.errors[0].message);
        reject(err.errors[0].message);
      });
  });
}

// makeProxy("c3e3178d7a28de219723cc429da9d3cd26745702afe19c6319a8f97920c69884", {
//   username: "root",
//   password: "password",
//   loc: "us-west"
// })
//   .then(data => console.log(data))
//   .catch(err => {
//     console.log(err);
//   });

module.exports = makeProxy;

console.log(guid().toLocaleLowerCase());

// makeProxy(
//   "peak-vista-227822;proxygen@peak-vista-227822.iam.gserviceaccount.com;-----BEGIN PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDv7Y/9A022qvM5ZdrhM7IXYCHqYbcvYSuJw8QJLqtPEy/TFNof4OQNEd8w+IYXrA7+4RyM+BfqQpAB9YIQRxh5y7qNDqDbXOWU0UMR1kJ2Zr6L9017MqaVoBsL1LM6IuiV5HuT4cEvCod56GsVy/AyDQ0vgWOrJqGsYsTGA8UfD//oOb34tA3LFWzCetbFlqD4BzgI5QeFL9MpaYQ1Q0S1edONv34j8uIttEUfGsfMHVLD3XE64rXtKHgixv6jZVFCUT5RLeVVOv5n+Hao3aum2QxviaqpSJWLt75ZZ1kSV6nc5JAXO9FDimmZ0094eu9DsFPJlr62fqGWwHm1Fb7/AgMBAAECggEAAtR1f1F7qCzqA4JNC5z1e8sZe089vuRRhCV3+XfAc4VRahbz365iYjkUvdogksTnxF/ZW1xNw+iXFD7WEuUTx9P8Vk+W3B+DYbb6KIqza/wYQURgeJSHXHpv9zrCBmyE+8efIYZnJevk3y47nR0zrxNyVV4cU9d3zrW3hnJi79PVootHJ44zSVEHOgnQmbyStq5neFpPe7I/sIqjuyafyukpxbGQxATJUMNTv8B5iRATheV8Cx4WvIgGE7F6QOrPPr2oJmM0qmxohBtruCa2ZwBr2aJj5Yd6WkatGT8xPZaxiOC7Zdsh9xJC6bjBhGCmb1kr+6sEczJnvpQBXtZ16QKBgQD/SjpcUjvT9xGVsOP6au88hMZZDE9+HtQNpWoO3XEIrFClAtPHAU68NC+6l2822FOWPa5u6771WO3v1HYoEKpivUOMWFwDvzFbzBgwFS1kHhQURY8hEVwvmta+R+ZmRy+3O5YYydhjCFh3XU9/245t6VEjgKH7Tx5nwkEXmI+XBQKBgQDwmGV73lIxYKk/stvdfwafUMWfeyqe7JLzSZoHIWP4oS+UQvGGQkBacy2aZnp09JQ5DkuCm0RBiGK8EDO2UXemJA0RquAaq97u8K2pvZrmmA/dUfi0rFUW3vxdJ5ihukmv38+IqPLju0kiQz+CZ4yGpwEGR0zRPgbT1T4oid5VMwKBgH61SOIprqg2KPQzJ/RSvws6m3f3ND1U78sWHt3h6why/lPoY1SSwZGIFWh3YSvHkzUuyDUlrVH5IZ+3xC1+mBMJ/UzbTlBNxSHa2uaCnFTk2PJ20+OFykuWfp9S8HgzPOulF4qWJGCC8+XK2nqLbtX+x9bnMX6admzpbYVYo2xBAoGAC4Qv72Lv6j8nOs5T6eFHrt6N5xldK+hFDHIsdkTp5R/KCD3AE94d+HZk62wWVnzSj3yYrrLB7KUbnMblwsdZg9Fb8smMGpq5fBR3K5XQ0VLcB4sB7ZwGIqcfy1G2457oIgwDghYcMjxnvsUbSCGuv09FJEjLa4SdjQw7AnO++bMCgYBfPteO+ZRKIw1mhVYccqc5F3oHaulDrEJfRx5ZKZ1XagWuZrMQdNBp6okvojyXFwemwTOjBD8jOQOkEtrH3YsNOV69HBkz2/07mlt53w6UwSxJShKvX45KFcwVnD7jKADY72xD+3SkQngrMg6mw7XkqNe06wGOec6Fn9Zt5IKhmA==-----END PRIVATE KEY-----",
//   { loc: "us-east1-b", username: "root", password: "password" }
// );
// makeProxy("26N4HF4DSB2QUFFZ7TNQQWTXCTHIJYULZTJQ", {});

//resolve
//ip
//vpsId

