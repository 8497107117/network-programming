var HOST = process.argv[2] || '127.0.0.1';
var PORT = process.argv[3] || 2147;

var server = require('dgram').createSocket('udp4');

var accounts = [];

server.on('listening', function(){
    var address = this.address();
    console.log('Server listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log(remote.address + ":" + remote.port +" "+ Date());
    //request errorCheck
    message = message.toString().replace(/\'/g,'"').replace(/\;/g,' ').replace(/\0/g,' ');
    console.log("Server receive: " + message);
    var request = JSON.parse(message.toString());
    var response = "";
    var command = request.action;

    switch(command){
        case 'init':
            var accountID = request.account_id;
            var accountName = request.account_name;
            response = init(accountID, accountName, remote.port);
            break;
        case 'save':
            var money = request.money;
            response = save(money, remote.port);
            break;
        case 'withdraw':
            var money = request.money;
            response = withdraw(money, remote.port);
            break;
        case 'remit':
            var money = request.money;
            var destinationName = request.destination_name;
            response = remit(money, remote.port, destinationName);
            break;
        case 'show':
            response = show(remote.port);
            break;
        case 'bomb':
            response = bomb();
            break;
        case 'end':
            response = end();
            break;
        default:
            break;
    }
    this.send(response, 0, response.length, remote.port, remote.address, (err) => {
        if(err)
            throw err;
    });
});

server.bind(PORT, HOST);

function getIndex(port){
    for(var i = 0;i < accounts.length;i++)
        if(accounts[i].port == port.toString())
            return i;
    return -1;
};

function getIndexByName(destinationName){
    for(var i = 0;i < accounts.length;i++)
        if(accounts[i].accountName == destinationName)
            return i;
    return -1;
}

function checkID(accountID){
    for(var i = 0;i < accounts.length;i++)
        if(accounts[i].accountID == accountID)
            return true;
    return false; 
};

function init(accountID, accountName, port){
    var response = new Object();
    var newAccount = new Object();

    if(checkID(accountID) == true)
        response.message = "account_id has been registered";
    else{
        newAccount.accountID = accountID;
        newAccount.accountName = accountName;
        newAccount.money = 0;
        newAccount.port = port.toString();
        accounts.push(newAccount);  
        response.message = "ok";
    }
    return JSON.stringify(response);
};

function save(money, port){
    var index = getIndex(port.toString());
    var response = new Object();
    if(index >= 0){
        accounts[index].money += money;
        response.message = "ok"; 
    }
    else
        response.message = "invalid transaction";
    return JSON.stringify(response); 
};

function withdraw(money, port){
    var index = getIndex(port.toString());
    var response = new Object();
    if(index >= 0 && accounts[index].money >= money){
        accounts[index].money -= money;
        response.message = "ok";
    }
    else
        response.message = "invalid transaction";
    return JSON.stringify(response);
};

function remit(money, port, destinationName){
    var index = getIndex(port.toString());
    var desIndex = getIndexByName(destinationName);
    var response = new Object();
    if(index >= 0 && accounts[index].money >= money && desIndex >= 0 && index != desIndex){
        accounts[index].money -= money;
        accounts[desIndex].money += money;
        response.message = "ok";
    }
    else
        response.message = "invalid transaction";
    return JSON.stringify(response);
};

function show(port){
    var index = getIndex(port.toString());
    var response = new Object();
    if(index >= 0){
        response.message = accounts[index].money;
    }
    else
        response.message = "account not find";
    return JSON.stringify(response);
};

function bomb(){
    for(var i = 0;i < accounts.length;i++)
        accounts[i].money = 0;
    var response = new Object();
    response.message = "ok";
    return JSON.stringify(response);
};

function end(){
    var accountNum = accounts.length;
    while(accountNum--)
        accounts.pop();
    var response = new Object();
    response.message = "end";
    return JSON.stringify(response);    
};
