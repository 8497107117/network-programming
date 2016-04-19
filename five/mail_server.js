module.exports = function(){
    return new mailServer();
};

//init
var mailServer = function(){
    this.accounts = [];
};

//clean all information of someone
mailServer.prototype.exit = function(port){
    var index = getIndex(port, this);
    this.accounts.splice(index, 1);
    return "exit\n"; 
};

mailServer.prototype.init = function(){
    var account = new Object();

};

function getIndex(port, obj){
    for(var i = 0;i < obj.accounts.length;i++)
        if(obj.accounts[i].port == i)
            return i;
    return -1; 
};
