var fs = require("fs");
var http = require("http");
var url = require("url");
var crypto = require('crypto');
var forge = require('node-forge');
var KEYPAIR = require('keypair');


var server = function () {
    var server = http.createServer();
    server.listen(8888);
    server.on('request', function (request, response) {
        debugger;
        var pathname = url.parse(request.url).pathname;
        //plugin
        if (pathname.includes("/resources/")) {
            var txt = fs.readFileSync(pathname, "utf8");
            response.write(txt);
            response.end();
            return;
        }
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
        if (pathname === "/saveData") {
            let body = [];
            request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                var data = JSON.parse(body);
                var password = hashPassword(data.kData.passphrase);
                var rsa = new RSA();
                var rsaKey = rsa.genRsaKey(data.kData.keylen).getKey();
//                var dataSave = {password: password, rsaKey: rsaKey, pData: data.pData};
                saveData(data.pData, "data");
                saveData(rsaKey, "key");
                saveData(password, "password");


            });
        }
        response.write("Error 404");
        response.end();
    });
    function hashPassword(password) {
        function generateSalt(len) {
            var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
                    setLen = set.length,
                    salt = '';
            for (var i = 0; i < len; i++) {
                var p = Math.floor(Math.random() * setLen);
                salt += set[p];
            }
            return salt;
        }
        var salt = generateSalt(10);
        var hash = crypto.createHash('md5').update(salt + password.toString()).digest('hex');
        return {
            salt: salt,
            hash: hash};
    }
    function checkPassword(password) {
        var data = JSON.parse(fs.writeFileSync("Storage/password.txt", 'utf8'));
        var hash = crypto.createHash('md5').update(data.salt + password.toString()).digest('hex');
        return hash === data.hash;
    }
    function saveData(data, fileName) {
        var stringData = JSON.stringify(data);
        fs.writeFileSync("Storage/" + fileName + ".txt", stringData);
    }
}();
var RSA = function () {
    var keypair;
    function genRsaKey(length) {
        keypair = KEYPAIR(length);
        return this;
    }
    ;
    function getKey() {
        return keypair;
    }
    return {genRsaKey: genRsaKey, getKey: getKey};
};