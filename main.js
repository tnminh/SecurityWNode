var fs = require("fs");
var http = require("http");
var url = require("url");
var crypto = require('crypto');

var server = function () {
    var server = http.createServer();
    server.listen(8888);
    server.on('request', function (request, response) {
        debugger;
        var pathname = url.parse(request.url).pathname;
        //plugin
        if (pathname === "/plugin/jquery.min.js") {
            var txt = fs.readFileSync("plugin/jquery.min.js", "utf8");
            response.write(txt);
            response.end();
            return;
        }
        //js
        if (pathname === "/js/app.js") {
            var txt = fs.readFileSync("js/app.js", "utf8");
            response.write(txt);
            response.end();
            return;
        }
        //html
        if (pathname === "/") {
            var txt = fs.readFileSync("html/app.html", "utf8");
            response.write(txt);
            response.end();
            return;
        }
        if (pathname === "/genRsaKey") {
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                var data =JSON.parse(body)
                savePassword(data);
            });
        }
        response.write("Error 404");
        response.end();
    });
    function hashPassword(password) {
        var salt = crypto.randomBytes(128).toString('base64');
        var iterations = 10000;
        var hash = crypto.pbkdf2(password, salt, iterations);

        return {
            salt: salt,
            hash: hash        };
    }
    function savePassword(passData) {
        var stringData = JSON.stringify(passData);
        fs.writeFileSync("Storage/password.txt", stringData);
    }
}();