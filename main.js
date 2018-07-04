var fs = require("fs");
var http = require("http");
var url = require("url");
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
    response.write("Error 404");
    response.end();
});