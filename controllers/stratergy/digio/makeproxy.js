const request = require("request");
const makeScript = require("./createScript.js");

var polls = [];
var elapsed = [];
function pollVps(key, vpsId, poll, resolve) {
  console.log("Polling");
  request(
    {
      url: "https://api.digitalocean.com/v2/droplets",
      headers: {
        Authorization: "Bearer " + key
      }
    },
    (err, resp, body) => {
      if (resp.statusCode == 200) {
        if (elapsed[poll] > 15) {
          reject();
        }

        body = JSON.parse(body);
        body.droplets.forEach(droplet => {
          if (droplet.id == vpsId) {
            if (droplet.networks.v4.length > 0) {
              console.log(droplet.networks.v4[0].ip_address);
              resolve({
                ip: droplet.networks.v4[0].ip_address,
                vpsId: vpsId
              });
              clearInterval(polls[poll]);
            }
          }
        });
      } else {
        console.log(body);
      }
      if (err) {
        console.log(err);
      }
    }
  );
}

function makeProxy(key, script) {
  return new Promise(function(resolve, reject) {
    var dropletData = {
      name: "proxygen.app",
      region: script.loc,
      size: "512mb",
      image: "centos-7-x64",
      ssh_keys: null,
      monitoring: true,
      user_data:
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
    };
    request(
      {
        url: "https://api.digitalocean.com/v2/droplets",
        headers: {
          Authorization: "Bearer " + key
        },
        method: "POST",
        json: dropletData
      },
      (err, resp, body) => {
        if (resp.statusCode == 202) {
          var index = polls.length;

          var vpsId = body.droplet.id;
          var longPoll = setInterval(pollVps, 1000, key, vpsId, index, resolve);
          elapsed.push(0);
          polls.push(longPoll);
        } else {
          reject("Error");
          console.log("eror");
        }
      }
    );
  });
}

// function getdrops() {
//   request(
//     {
//       url: "https://api.digitalocean.com/v2/images?per_page=999",
//       headers: {
//         Authorization:
//           "Bearer e399797520e82205a4e278ea501a8f89378b0db5288718bc615f0d7738bd7716"
//       }
//     },
//     (err, resp, body) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(body);
//     }
//   );
// }

//Data incoming
//loc

//Resolve
// ip : (VPS IP)
// vpsID : VPS ID
//Will have username pass

module.exports = makeProxy;
// makeProxy("26N4HF4DSB2QUFFZ7TNQQWTXCTHIJYULZTJQ", {});
