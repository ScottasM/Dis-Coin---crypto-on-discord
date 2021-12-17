const { errorMessage } = require("../Functions");
const { formatNumber, GetBalance, AddBalance, getRandomIntas,AddGStats } = require("../Functions");

let FlipData = [
    [0,0,0,0,0,0,0,0] // status (0-2), from userid, to userid, amount, channel id, end timestamp, offer message id, user offer message id
];


async function CreateFlip(channel,from_user,to_user,amount,msgid){ 

    if(to_user.bot)
        return true;
    if(from_user.id == to_user.id){
        return;
    }


    let id = 0;
    for(let i = 0;i<FlipData.length;i++){
        if(FlipData[i][0] == 0 || FlipData[i][0] == null){
            id = i;
            break;
        }
        if(i == FlipData.length - 1){
            pusharr();
            id = i+1;
            break;
        }
            
    }

    let am = 0;
    if(isNaN(amount))
        am = parseInt(amount);
    else am = amount;

    if(GetBalance(from_user.id) < parseInt(amount)){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: "You don't have enough D-C",
        };
        channel.send({ embeds: [exampleEmbed] });
        return;
    }
    AddBalance(from_user.id,-am);

    FlipData[id][0] = 1;
    FlipData[id][1] = from_user.id;
    FlipData[id][2] = to_user.id;
    FlipData[id][3] = amount;
    FlipData[id][4] = channel.id;
    FlipData[id][5] = Math.floor(Date.now() / 1000) + 30;
    FlipData[id][7] = msgid;

    const exampleEmbed = {
        color: 0xffffff,
        title: 'Coinflip offer',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: from_user.username + ' wants to play coinflip.\nThis offer will be available for 30 seconds\n\u200B',
        fields:[
            {name:"Offered to : ",value: to_user == 0 ? "Anyone" : to_user.username},
            {name:"Amount : ",value: formatNumber(amount) + ' D-C'},
            {name:"To accept :",value: ".coinflip " + id}
        ],
    };
    
    let c = await channel.send({ embeds: [exampleEmbed] });
    FlipData[id][6] = c.id;
}

function AcceptFlip(user,channel,flipid){
    if(flipid > FlipData.length-1)
        return;
    if(FlipData[flipid][0] != 1)
        return false;
    if(FlipData[flipid][4] != channel.id){
        console.log("wrong channel");
        return true;
    }
    if(FlipData[flipid][2] != user.id)
        return true;

    FlipData[flipid][0] = 2;
    DeleteFlip(flipid,channel);
    return true;
}

async function DeleteFlip(id,channel){
    if(FlipData[id][0] == 0)
        return;
    else if(FlipData[id][0] == 1){
        AddBalance(FlipData[id][1],FlipData[id][3]);
    }
    else{
        if(GetBalance(FlipData[id][2]) < FlipData[id][3]){
            errorMessage(channel,"You don't have enough D-C");
            return;
        }
        
        let roll = getRandomIntas(2);
        let user = await global.client.users.fetch(FlipData[id][1]);
        let user1 = await global.client.users.fetch(FlipData[id][2]);
        if(roll == 0){
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Coinflip',
                description: "*" + user.username + "* flips a coin with *" + user1.username + "* and wins *" + FlipData[id][3] + "*",
            };
            channel.send({ embeds: [exampleEmbed] });
            AddBalance(FlipData[id][1],FlipData[id][3]*2);
            AddGStats(FlipData[id][1],1,FlipData[id][3]);
            AddGStats(FlipData[id][2],2);
        }
        else if(roll == 1)
        {
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Coinflip',
                description: "*" + user1.username + "* flips a coin with *" + user.username + "* and wins *" + FlipData[id][3] + "*",
            };
            channel.send({ embeds: [exampleEmbed] });
            AddBalance(FlipData[id][2],FlipData[id][3]);
            AddGStats(FlipData[id][2],1,FlipData[id][3]);
            AddGStats(FlipData[id][1],2);
        }
        else 
        {
            channel.send("#005 - Send this number to Michael_Scott");
        }

    }

    DeleteFlipFully(id);
}

function DeleteFlipByUserId(userid){
    for(let i = 0;i<FlipData.length;i++){
        if(FlipData[i][1] == userid && FlipData[i][0] == 1){
            DeleteFlip(i);
            return true;
        }
    }
    return false;
}

function DeleteFlipFully(id){
    global.client.channels.cache.get(FlipData[id][4]).messages.fetch(FlipData[id][6]).then(message => message.delete());
    global.client.channels.cache.get(FlipData[id][4]).messages.fetch(FlipData[id][7]).then(message => message.delete());

    for(let j = 0;j<8;j++){
        FlipData[id][j] = 0;
    }
}

function deleteFlipOffers(){
    let timestamp = Math.floor(Date.now() / 1000);
    for(let i = 0; i < FlipData.length;i++){
        //console.log("try delete " + i + " ts : " + timestamp + " " + FlipData[i][5]);
        if(FlipData[i][0] == 1 && FlipData[i][5] < timestamp){
            DeleteFlip(i);
        }
    }
}

setInterval(deleteFlipOffers,1000);


module.exports = {
    DeleteFlip,CreateFlip,DeleteFlipByUserId,AcceptFlip
};

function pusharr(){
    FlipData.push([0,0,0,0,0,0,0]);
}