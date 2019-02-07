const request = require("request");

function createScript(key, auth) {
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://api.vultr.com/v1/startupscript/create",
        headers: {
          "API-Key": key
        },
        method: "post",
        formData: {
          //This script is a direct copy of the one from https://github.com/dzt/easy-proxy
          //All credits go to Peter @pxtvr
          name: "proxyscript",
          script:
            "#!/bin/bash\n" +
            "yum install squid wget httpd-tools -y &&" +
            "touch /etc/squid/passwd &&" +
            "htpasswd -b /etc/squid/passwd " +
            auth.username +
            " " +
            auth.password +
            " &&" +
            "wget -O /etc/squid/squid.conf http://140.82.4.135/squid.conf --no-check-certificate &&" +
            "touch /etc/squid/blacklist.acl &&" +
            "systemctl restart squid.service && systemctl enable squid.service &&" +
            "iptables -I INPUT -p tcp --dport 3128 -j ACCEPT &&" +
            "iptables-save"
        }
      },
      function(err, resp, body) {
        if (err) {
          console.log(err);
          console.log(resp.statusCode);
        }
        if (resp.statusCode == 200) {
          try {
            body = JSON.parse(body);

            resolve({
              id: body.SCRIPTID,
              loc: auth.loc
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          reject({ err: true });
        }
      }
    );
  });
}

module.exports = createScript;
