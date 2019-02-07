var request = require('request');

const fs = require('fs');
var jar = request.jar();
request.post({
    url: "http://localhost:3000/auth/login",
    json: {
        key: "5c166bf73cccf595a4d553c6"
    },
    jar
}, (err, resp, bod) => {
    if (!err) {
        console.log(bod);
        fs.writeFileSync(__dirname + '/testcookie.txt', JSON.stringify(jar));
        console.log(resp.headers);
        request.post({
            url: "http://localhost:3000/auth/login",
            json: {
                key: "5c166bf73cccf595a4d553c6"
            },
            jar
        }, (err, resp, bod) => {

            console.log(bod);
        });
    }
})