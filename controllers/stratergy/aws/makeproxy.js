const aws = require("aws-sdk");
const base64 = require("base-64");
const uuid = require("uuid/v1");

var pollInterval = [];

/**
 *  If this is used as a singleton pollInterval being global will always be updated.
 *
 *
 */

var elapsed = [];

function getImage(ec2) {
  return new Promise((resolve, reject) => {
    ec2.describeImages(
      {
        Filters: [
          {
            Name: "product-code",
            Values: ["aw0evgkw8e5c1q413zgy5pjce"]
          }
        ]
      },
      (err, data) => {
        if (err) {
          console.log(err);
          reject();
        } else {
          resolve(data.Images[0].ImageId);
        }
      }
    );
  });
}

function openPort(ec2) {
  return new Promise(function(resolve, reject) {
    var params = {
      GroupId: "sg-903004f8",

      IpPermissions: [
        {
          FromPort: 3128,
          IpProtocol: "tcp",
          IpRanges: [
            {
              CidrIp: "0.0.0.0/0",
              Description: "Access the the proxy"
            }
          ],
          ToPort: 3128
        }
      ]
    };

    ec2.describeSecurityGroups({}, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        data.SecurityGroups.forEach(group => {
          if (group.GroupName == "default") {
            params.GroupId = group.GroupId;
            ec2.authorizeSecurityGroupIngress(params, (err, data) => {
              ec2.authorizeSecurityGroupEgress(params, (err, data) => {
                resolve();
              });
            });
          }
        });
      }
    });
  });
}

function makeProxy(key, script) {
  return new Promise(function(resolve, reject) {
    console.log(script.loc);
    var keyString = key.split(";");
    if (keyString.length !== 2) {
      return reject({
        error: "Split is messed"
      });
    }
    var ec2 = new aws.EC2({
      accessKeyId: keyString[0],
      secretAccessKey: keyString[1],
      region: script.loc
    });

    openPort(ec2).then(() => {
      getImage(ec2).then(amazonId => {
        var uniqueID = uuid();
        var params = {

          ImageId: amazonId,
          InstanceType: "t2.micro",
          UserData: base64.encode(
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
          ),
          MaxCount: script.qty,
          MinCount: 1,
          TagSpecifications: [
            {
              ResourceType: "instance",
              Tags: [
                {
                  Key: "proxy",
                  Value: uniqueID
                }
              ]
            }
          ]
        };
        ec2.runInstances(params, (err, body) => {
          if (err) {
            resolve({
              publicIps,
              uuid,
              error: "AWS Error : " + err.message
            });
            console.log(err);
          } else {
            //
            var iden = pollInterval.length;
            var epid = elapsed.length;
            elapsed[epid] = 0;
            pollInterval.push(
              setInterval(
                poll,
                1000,
                ec2,
                uniqueID,
                script.qty,
                resolve,
                iden,
                epid
              )
            );
          }
        });
      });
      //Make proxies using the quantity given.
    });
  });
}

//Script gives lov0222222222222222222
//Script gives id

function poll(ec2, uuid, qty, resolve, id, epid) {
  //Polls for ips

  ec2.describeInstances({}, (err, data) => {
    if (!err) {
      var publicIps = {};

      data.Reservations.forEach(reservation => {
        reservation.Instances.forEach(instance => {
          if (instance.Tags[0] && instance.Tags[0].Value == uuid) {
            publicIps[instance.PublicIpAddress] = { created: "ok" };
          }
        });
      });

      if (elapsed[epid] > 15) {
        clearInterval(pollInterval[id]);
        delete elapsed[epid];
        delete pollInterval[id];

        console.log("AWS T/O");
        resolve({
          publicIps,
          uuid,
          error:
            "AWS denied to allow you your selected quantity. Some proxies have been created."
        });
        return;
      }

      if (Object.keys(publicIps).length == qty) {
        console.log(publicIps);
        clearInterval(pollInterval[id]);
        delete elapsed[epid];
        delete pollInterval[id];

        resolve({ publicIps, uuid });
      } else {
        console.log("not enough proxies");
        elapsed[epid]++;
        console.log(data.Reservations);
      }
    }
  });
}

module.exports = makeProxy;
//username
//password
//loc
//qty

//resolves with keys corresponding to ips and uuid
