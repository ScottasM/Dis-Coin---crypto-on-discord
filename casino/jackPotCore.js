const { errorMessage, AddGStats } = require("../Functions");
const { formatNumber, GetBalance, AddBalance, getRandomIntas } = require("../Functions");

let PotData = [
    [0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0] // status (0-2), max entry, max players, total pot,messageid,channelid,timestamp, next 12 - players 
];

let userPotData = {
    "1":{
        pid : 0,
        joinprice : 0,
        name:"empty"
    }
};


async function CreatePot(channel,maxamount,maxplayers){ 
    let id = 0;
    for(let i = 0;i<PotData.length;i++){
        if(PotData[i][0] == 0 || PotData[i][0] == null){
            id = i;
            break;
        }
        if(i == PotData.length - 1){
            pusharr();
            id = i+1;
            break;
        }
    }

    if(maxamount == 0)
        maxamount = 10000;
    
    if(maxplayers == 0 || maxplayers > 12)
        maxplayers = 12;

    PotData[id][0] = 1;
    PotData[id][1] = maxamount;
    PotData[id][2] = maxplayers;
    PotData[id][3] = 0;
    PotData[id][5] = channel.id;
    PotData[id][6] = Math.floor(Date.now() / 1000) + 15;

    for(let i = 7;i<PotData[id].length;i++){
        PotData[id][i] = 0;
    }

    const exampleEmbed = {
        color: 0xffffff,
        title: 'Jackpot offer',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: 'Jackpot is a game where anyone can join with their desired amount of coins.\nOnce the timer ends, every player gets a chance to win based on how much they joined with compared to the total pot\nThis jackpot will be rolled in 2 minutes since its creation\n\u200B',
        fields:[
            {name:"Pot :",value: "0 D-C"},
            {name:"Maximum entry : ",value: maxamount + " D-C"},
            {name:"Maximum players : ",value: String(maxplayers)},
            {name:"To join :",value: ".joinpot " + id + " [amount]"},
            {name:"Players : ",value:"No one has joined this jackpot yet"}
        ],
    };
    
    let c = await channel.send({ embeds: [exampleEmbed] });
    PotData[id][4] = c.id;
}

function leavePot(userid){
    if(userPotData[userid].pid < 1){
        return false;
    }
    let pd = userPotData[userid].pid-1;
    for(let i = 7;i<PotData[pd].length;i++){
        if(PotData[pd][i] == userid){
            PotData[pd][i] = 0;
            break;
        }
    }
    userPotData[userid].pid = 0;
    PotData[pd][3]-=userPotData[userid].joinprice;
    AddBalance(userid,userPotData[userid].joinprice);
    userPotData[userid].joinprice = 0;
    updatePotMessage(pd);
    return true;
}

function JoinPot(user,channel,potid,amount){
    if(potid > PotData.length-1)
        return false;
    if(PotData[potid][0] != 1)
        return false;
    if(PotData[potid][5] != channel.id){
        console.log("wrong channel");
        return true;
    }
    if(!userPotData[user.id])
        userPotData[user.id] = {pid: 0, joinprice: 0, name: user.username};
    if(userPotData[user.id].pid > 0){
        errorMessage(channel,"You already are in a jackpot. Use .joinpot without specifying anything to leave",true);
        return true;
    }
    if(PotData[potid][1] < amount){
        errorMessage(channel,"Your specified amount exceeds the maximum joining amount in the jackpot",true);
        return true;
    }
    let totalplayers = 0,emptyone = 0;
    for(let i = 7;i<PotData[potid].length;i++){
        if(PotData[potid][i] > 0){
            totalplayers++;
            if(totalplayers == PotData[potid][2]){
                errorMessage(channel,"Jackpot is already full",true);
                return true;
            }
        }
        else{
            if(emptyone > i || emptyone == 0)
                emptyone = i;
        } 
    }

    if(totalplayers == 12 || emptyone == 0){
        errorMessage(channel,"Jackpot is already full",true);
        return true;
    }

    PotData[potid][emptyone] = user.id;
    userPotData[user.id] = {pid: potid+1, joinprice: amount, name: user.username};
    AddBalance(user.id,-amount);
    PotData[potid][3] += amount;

    updatePotMessage(potid);
    return true;
}

async function DeletePot(id){
    let winner = 0;
    if(PotData[id][0] == 0)
        return;
    else if(PotData[id][0] == 1){
        for(let i = 7;i<PotData[id].length;i++){
            let uid = PotData[id][i];
            if(uid > 0 && userPotData[uid].pid-1 == id){
                AddBalance(uid,userPotData[uid].joinprice);
                userPotData[uid].pid = 0;
                userPotData[uid].joinprice = 0; 
                PotData[id][i] = 0;
            }
        }
    }
    else{
        let rand = getRandomIntas(PotData[id][3]);
        let cur = 0;
        for(let i = 7;i<PotData[id].length;i++){
            let userid = PotData[id][i];
            if(userid > 0 && userPotData[userid].pid-1 == id){
                if(cur + userPotData[userid].joinprice >= rand){
                    AddBalance(userid,PotData[id][3]);
                    const exampleEmbed = {
                        color: 0xffffff,
                        title: 'Jackpot',
                        description: "*" + userPotData[userid].name + "* won the *" + formatNumber(PotData[id][3]) + " D-C* jackpot with a *" + (userPotData[userid].joinprice/PotData[id][3]*100).toFixed(2) + "%* win chance", 
                    };
                    let chnl = await global.client.channels.cache.get(PotData[id][5]);
                    chnl.send({ embeds: [exampleEmbed] });
                    break;
                }
                else cur += userPotData[userid].joinprice;
            }
        }
    }
    
    //global.client.channels.cache.get(PotData[id][5]).messages.fetch(PotData[id][4]).then(message => message.delete());
    let winnings;
    if(winner > 0){
        winnings = PotData[id][3];
    }
    for(let i = 0;i<PotData[id].length;i++){
        if(i >= 7){
            let userid = PotData[id][i];
            if(userid > 0 && userPotData[userid].pid-1 == id){
                userPotData[userid].pid = 0;
                userPotData[userid].joinprice = 0;
                if(winner > 0){
                    if(winner == userid)
                        AddGStats(userid,1,winnings);
                    else 
                        AddGStats(userid,2);
                    
                }
            }
        }
        PotData[id][i] = 0;
    }
}

function rollPots(){
    let timestamp = Math.floor(Date.now() / 1000);
    for(let i = 0; i < PotData.length;i++){
        if(PotData[i][0] == 1 && PotData[i][6] < timestamp){
            PotData[i][0]=2;
            DeletePot(i);
        }
    }
}

async function updatePotMessage(id){
    let players = "";
    for(let i = 7;i<PotData[id].length;i++){
        let userid = PotData[id][i];
        if(userid > 0 && userPotData[userid].pid-1 == id){
            players+= userPotData[userid].name + " - " + userPotData[userid].joinprice + "(" + (userPotData[userid].joinprice/PotData[id][3]*100).toFixed(2) + "%)\n";
        }
    }
    if(players == "")
        players = "No one has joined this jackpot yet";
    
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Jackpot offer',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: 'Jackpot is a game where anyone can join with their desired amount of coins.\nOnce the timer ends, every player gets a chance to win based on how much they joined with compared to the total pot\nThis jackpot will be rolled in 3 minutes since its creation\n\u200B',
        fields:[
            {name:"Pot :",value: String(PotData[id][3]) + "D-C"},
            {name:"Maximum entry : ",value: PotData[id][1] + " D-C"},
            {name:"Maximum players : ",value: String(PotData[id][2])},
            {name:"To join :",value: ".joinpot " + id + " [amount]"},
            {name:"Players : ",value:players}
        ],
    };
    msg = await global.client.channels.cache.get(PotData[id][5]).messages.fetch(PotData[id][4]);
    msg.edit({embeds : [exampleEmbed]});
}

setInterval(rollPots,1000);

module.exports = {
    DeletePot,CreatePot,JoinPot,leavePot
};

function pusharr(){
    PotData.push([0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0]);
}