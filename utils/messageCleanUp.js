let messageData=[
    [0,0,0] // channelid, messageid, stamp
]

function addMessageDelete(channelid,messageid,seconds){
    let id = 0;

    for(let i = 0;i<messageData.length;i++){
        if(messageData[i][0] == 0){
            id = i;
            break;
        }
        if(i == messageData.length - 1){
            pusharr();
            id = i+1;
            break;
        }
    }

    messageData[id][0] = channelid;
    messageData[id][1] = messageid;
    messageData[id][2] = Math.floor(Date.now() / 1000) + seconds;
}

function deleteMessages(){
    let timestamp = Math.floor(Date.now() / 1000);
    for(let i = 0; i < messageData.length;i++){
        if(messageData[i][0] != null && messageData[i][0] != 0 && messageData[i][2] < timestamp){
            deleteMessage(i);
        }
    }
}

setInterval(deleteMessages,1000);

function deleteMessage(id){
    global.client.channels.cache.get(messageData[id][0]).messages.fetch(messageData[id][1]).then(message => message.delete());

    for(let j = 0;j<3;j++){
        messageData[id][j] = 0;
    }
}


function pusharr(){
    messageData.push([0,0,0]);
}

module.exports ={
    addMessageDelete
}