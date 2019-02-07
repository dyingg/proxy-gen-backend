
var Tasks = require('../../models/tasks');
var Proxies = require('../../models/proxy');
function getProxies(req, res) {

    if (req.params.id) {
        Proxies.find({
            taskId: req.params.id
        }).then(data => {
            if (data) {
                return res.json(data);

            }
            else {
                return res.json({
                    fail: "Incorrect Id",
                    code: 106
                })
            }
        }).catch(err => {
            console.log(err);
            return res.json({
                fail: "Malformed",
                code: 99
            })
        });

    }
    else {
        return res.json({
            fail: "Malformed",
            code: 99
        })
    }
}

module.exports = getProxies;