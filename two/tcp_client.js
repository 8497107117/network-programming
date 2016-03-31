var HOST = process.argv[2] || '127.0.0.1';
var PORT = process.argv[3] || 2147;

// stdIO
var rl = require('readline').createInterface(process.stdin,process.stdout);
rl.setPrompt('>');

//control
var win = 0, newGame = 0, connected = 0;

//network
var net = require('net');
var client = new net.Socket(); 

console.log('Welcome to the Game 2048!');
console.log('Enter \'help\' to get more information\n');
rl.prompt();

rl.on('line', function(line){
	var request = new Object();
	//remove whitespace
	line = line.trim();
	switch(line){
		case 'help':
			help();
			rl.prompt();
			break;
		case 'connect':
			if(connected){
				console.log('Have already connected to server');
				rl.prompt();
			}
			else{
				client.connect(PORT, HOST, function(){
					connected = 1;
					console.log('connect to game server');
					rl.prompt();
				});	
			}	
			break;
		case 'disconnect':
			if(connected){
				client.destroy();
				connected = 0;
				newGame = 0;
				console.log('disconnect from game server');
				rl.setPrompt('>');
				rl.prompt();
			}
			else{
				console.log('There is no connection between server and client');
				rl.prompt();
			}
			break;
		case 'new':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(newGame){
				console.log('Have already in a game round');			
				rl.prompt();
			}
			else{
				newGame = 1;
				rl.setPrompt('move>');
				request.action = "New";
				client.write(JSON.stringify(request));
			}	
			break;
		case 'end':
			if(!connected){
				console.log('Please connect to server first');		
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');		
				rl.prompt();
			}
			else{
				newGame = 0;
				rl.setPrompt('>');
				request.action = 'End';	
				client.write(JSON.stringify(request));			
			}
			break;
		case 'w':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'moveUp';				
				client.write(JSON.stringify(request));	
			}
			break;
		case 's':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'moveDown';
				client.write(JSON.stringify(request));	
			}
			break;
		case 'a':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'moveLeft';
				client.write(JSON.stringify(request));
			}
			break;
		case 'd':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'moveRight';
				client.write(JSON.stringify(request));
			}
			break;
		case 'u': 
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'unDo';
				client.write(JSON.stringify(request));
			}
			break;
		case 'FKQ':
			if(!connected){
				console.log('Please connect to server first');
				rl.prompt();
			}
			else if(!newGame){
				console.log('Please new a game round first');
				rl.prompt();
			}
			else{
				request.action = 'whosyourdaddy';
				client.write(JSON.stringify(request));
			}
			break;
		default:
			console.log('Illegal command');
			rl.prompt();
			break; 
	}
});

client.on('data', function(message){
	var response = JSON.parse(message.toString());
	if(response.status && response.message != "The game has closed"){
		// remove "," from {x, x, x, x, x...}
		var bricks = response.message.split(',');
		show(bricks);
	}
	//Game closed
	else if(response.status){
		console.log(response.message);
		newGame = 0;
		rl.setPrompt('>');
	}
	//Game not change
	else
		console.log(response.message);
	
	rl.prompt();
});

function show(bricks){
	console.log(' ');
	console.log('---------------------');
	for(var i = 0;i < 4;i++){
		var row = "|";
		for(var j = 0;j < 4;j++){
			if(bricks[i*4+j] == '2048')
				win = 1;
			//amount of whitespace
			var bits = bricks[i*4+j] == '0' ? 4 : 4 - bricks[i*4+j].length;
			while(bits--)
				row+=" ";
			if(bricks[i*4+j] != '0')
				row+=bricks[i*4+j];
			row+="|";
		}
		console.log(row);
		console.log('---------------------');
	}
	console.log(' ');
	if(win){
		var request = new Object();
		request.action = 'End';
		client.write(JSON.stringify(request));
		win = 0;
		newGame = 0;
		rl.setPrompt('>');
		console.log('Congrats!You win the game!');
	}
}

function help(){
	console.log('Enter keyboard:');
	console.log('\'connect\' - connect to game server');
	console.log('\'disconnect\' - disconnect from game server');
	console.log('\'new\' - new a game round');
	console.log('\'end\' - close the game');
	console.log('\'w\' - move bricks up');
	console.log('\'s\' - move bricks down');
	console.log('\'a\' - move bricks left');
	console.log('\'d\' - move bricks right');
	console.log('\'u\' - undo the last move');
}
