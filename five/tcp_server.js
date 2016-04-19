var HOST = process.argv[2] || '127.0.0.1';
var PORT = process.argv[3] || 2147;

var server = require('net').createServer();
var mailS = require("./mail_server");
var mailServer = mailS();

server.on('connection', function(socket){
    socket.on('date', function(message){
        var response;
        socket.write(response);
    });
});

server.listen(PORT, HOST);
console.log('TCP server listening on ' + HOST + ":" + PORT);
