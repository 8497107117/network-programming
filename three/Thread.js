//file open
var fs = require('fs'), encode = 'utf-8';
var filename = process.argv[2];

//map
var ground = ["", "", "", ""];

//multiprocess
var cluster = require('cluster');

fs.readFile(filename, encode, function(err, data){
    //readfile
    var len = data.toString().length;
    var x = 0, y = 0, state = 0, flag = 0;  
    for(var i = 0;i < len;i++){
        // row length
        if(data[i] == '\n' && !flag){
            x = i;
            flag++;
        }
        switch(state){
            case 0:
                if(data[i] != '#')
                    ground[state] += data[i];
                else if(data[i] == '#')
                    state = 1; 
                break;
            case 1:
                if(data[i] == '\n'){
                    state = data[i+1] == '#' ? 2 : 0;
                    y++;
                }
                else if(data[i] != '#')
                    ground[state] += data[i];
                break;
            case 2:
                if(data[i] != '#')
                    ground[state] += data[i];
                else if(data[i] == '#')
                    state = 3;
                break;
            case 3:
                if(data[i] == '\n'){
                    state = 2;
                    y++;
                }
                else if(data[i] != '#')
                    ground[state] += data[i];
                break;
            default:
                break;
        }
    }
    //Master process
    if(cluster.isMaster){
        //print the map
        var boarder = ' ', innerRow = '|';
        for(var i = 0;i < x;i++)
            boarder += '-';
        boarder += ' ';
        console.log(boarder);
        var count = 0;
        while(count < len){
            if(data[count] == '#' && data[count+1] != '#' && data[count+1] != '\n'){
                innerRow += '|';
                count++;
            }
            else if(data[count] == '#'){
               innerRow += '-';
               count++;
            }
            else if(data[count] == '\n'){
                innerRow += '|';
                console.log(innerRow);
                count++;
                innerRow = '|';
            }
            else
                innerRow += data[count++];
        }
        console.log(boarder);
        console.log('map size: ' + x + '*' + y);
        //4 child process for miner
        for(var i = 0;i < 4;i++)
            var worker = cluster.fork();    
        var score = [0, 0, 0, 0];
        var recvNum = 0;
        cluster.on('message', function(message){
            var response = JSON.parse(message);
            score[response.id-1] = response.score;
            recvNum++;
            if(recvNum == 4){
                var maxScore = -1;
                // 0 lose, 1 max, 2 draw
                var minerStatus = [0, 0, 0, 0];
                var winerNum = 1;
                // set maxScore
                for(var i = 0;i < 4;i++){
                    if(score[i] > maxScore)
                        maxScore = score[i];
                    else if(score[i] == maxScore)
                        winerNum++;
                }
                // set minerStatus
                for(var i = 0;i < 4;i++){
                    if(score[i] == maxScore)
                        minerStatus[i] = winerNum > 1 ? 2 : 1;
                }
                for(var i =0;i < 4;i++){
                    if(minerStatus[i] == 0)
                        console.log('Miner#'+ (i+1) + ': ' + score[i]);
                    else if(minerStatus[i] == 1)
                        console.log('Miner#'+ (i+1) + ': ' + score[i] + ' (win)');
                    else
                        console.log('Miner#'+ (i+1) + ': ' + score[i] + ' (draw)');
                }
            }            
        });
    }
    if(cluster.isWorker){
        var score = 0;
        var id = cluster.worker.id;
        for(var i = 0;i < ground[id-1].length;i++){
            if(ground[id-1][i] == '*')
                score++;
        }
        var response = new Object;
        response.id = id.toString();
        response.score = score;
        process.send(JSON.stringify(response));
        cluster.worker.kill();
    }
    return 0;
});
