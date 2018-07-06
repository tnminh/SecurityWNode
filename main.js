var fs = require("fs");
var http = require("http");
var url = require("url");
var crypto = require('crypto');
var forge = require('node-forge');
var KEYPAIR = require('keypair');


var server = function () {
    var STORAGELOCATION = 'Storage/data.txt';
    var server = http.createServer();
    server.listen(8888);
    server.on('request', function (request, response) {
        try {
            debugger;
            var pathname = url.parse(request.url).pathname;
            //plugin
            if (pathname.includes("/resources/")) {
                var txt = fs.readFileSync(pathname.substring(1), "utf8");
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

            if (pathname === "/loadData") {
                let body = [];
                request.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    var email = Buffer.concat(body).toString();
                    var data=loadData();
                    data=JSON.parse(data)
                    var emailData=data.filter(function(rec){
                        return rec.email===email;
                    });
                    emailData=emailData[0];
                    response.write(JSON.stringify({email:emailData.email,name:emailData.name,birthday:emailData.birthday,phone:emailData.phone,address:emailData.address}));
                    response.end();
                    return;
                });
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
                    data.pData.password = password;
                    oldData=JSON.parse(loadData());
                    saveData(data.pData, STORAGELOCATION);
                    saveData({ 'key': rsaKey.public }, data.kData.fileLocation + 'public.txt');
                    saveData({ 'key': rsaKey.public }, data.kData.fileLocation + 'private.txt');

                    // saveData(password, "password");


                });
            }
        }
        catch (err) {
            console.log(err);
            response.write("Error");
            response.end();
        }

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
            hash: hash
        };
    }
    function checkPassword(password) {
        var data = JSON.parse(fs.writeFileSync("Storage/password.txt", 'utf8'));
        var hash = crypto.createHash('md5').update(data.salt + password.toString()).digest('hex');
        return hash === data.hash;
    }
    function saveData(data, fileName) {
        try {
            var stringData = JSON.stringify(data);
            fs.writeFileSync(fileName, stringData, { flag: 'w' });
        }
        catch (err) {
            return "Đường dẫn không hợp lệ"
        }
        return 'ok';

    }
    function loadData() {
        try {
            var txt = fs.readFileSync(STORAGELOCATION, "utf8");
            return txt;
        }
        catch (err) {
            return 'error';
        }

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
    return { genRsaKey: genRsaKey, getKey: getKey };
};