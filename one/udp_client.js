var HOST = '127.0.0.1';
var PORT = 2148;
var serverPORT = 2147;  

var min = 3000, max = 60000, ans = (min + max)/2;
var count = 1;
var message = new Buffer('{"guess":"' + ans.toString() + '"}');

var client = require('dgram').createSocket('udp4');

client.bind(PORT, HOST);
client.on('listening', function(){
	var address = this.address();
	console.log('#set up');
	console.log('UDP Client listneing on ' + address.address + ':' + address.port);
	guess();
});

function guess(){
	client.send(message, 0, message.length, serverPORT, HOST, function(err){
		if(err)
			throw err;
	});
	console.log('#' + (count++).toString());
	console.log('send' + message);
};

client.on('message', function(message, remote){
	console.log('receive' + message);
	var response = JSON.parse(message.toString()), request = new Object();
	if(response.result == 'bingo!'){
		request.student_id = '0216023';
		remote.port = ans;
	}
	else if(response.result == 'Congrats! 0216023'){
		client.close();
		return;
	}
	else{
		if(response.result == 'larger')
			min = ans;
		else if(response.result == 'smaller')
			max = ans;
		ans = parseInt((max + min)/2);
		request.guess = ans.toString();
	}
	message = JSON.stringify(request);
	console.log('#' + (count++).toString());
	console.log('send' + message);
	client.send(message, 0, message.length, remote.port, remote.address);
});
