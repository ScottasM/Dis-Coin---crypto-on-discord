const { errorMessage } = require("../Functions");
const { formatNumber, GetBalance, AddBalance, getRandomIntas,AddGStats } = require("../Functions");

let DiceData = [
    [0,0,0,0,0,0,0,0] // status (0-2), from userid, to userid, amount, channel id, end timestamp, offer message id, user offer message id
];


async function CreateDice(channel,from_user,to_user,amount,msgid){ 

    if(to_user.bot)
        return true;
    if(from_user.id == to_user.id){
        return;
    }


    let id = 0;
    for(let i = 0;i<DiceData.length;i++){
        if(DiceData[i][0] == 0 || DiceData[i][0] == null){
            id = i;
            break;
        }
        if(i == DiceData.length - 1){
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

    DiceData[id][0] = 1;
    DiceData[id][1] = from_user.id;
    DiceData[id][2] = to_user.id;
    DiceData[id][3] = amount;
    DiceData[id][4] = channel.id;
    DiceData[id][5] = Math.floor(Date.now() / 1000) + 30;
    DiceData[id][7] = msgid;

    const exampleEmbed = {
        color: 0xffffff,
        title: 'Dice offer',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: from_user.username + ' wants to play dice.\nThis offer will be available for 30 seconds\n\u200B',
        fields:[
            {name:"Offered to : ",value: to_user == 0 ? "Anyone" : to_user.username},
            {name:"Amount : ",value: formatNumber(amount) + ' D-C'},
            {name:"To accept :",value: ".dice " + id}
        ],
    };
    
    let c = await channel.send({ embeds: [exampleEmbed] });
    DiceData[id][6] = c.id;
}

function AcceptDice(user,channel,diceid){
    if(diceid > DiceData.length-1)
        return;
    if(DiceData[diceid][0] != 1)
        return false;
    if(DiceData[diceid][4] != channel.id){
        console.log("wrong channel");
        return true;
    }
    if(DiceData[diceid][2] != user.id)
        return true;

    DiceData[diceid][0] = 2;
    DeleteDice(diceid,channel);
    return true;
}

async function DeleteDice(id,channel){
    if(DiceData[id][0] == 0)
        return;
    else if(DiceData[id][0] == 1){
        AddBalance(DiceData[id][1],DiceData[id][3]);
    }
    else{
        if(GetBalance(DiceData[id][2]) < DiceData[id][3]){
            errorMessage(channel,"You don't have enough D-C");
            return;
        }
        
        let roll1 = getRandomIntas(6)+1;
        let roll2 = getRandomIntas(6)+1;
        let user = await global.client.users.fetch(DiceData[id][1]);
        let user1 = await global.client.users.fetch(DiceData[id][2]);
        if(roll1 > roll2){
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Dice',
                description: "*" + user.username + "* rolls *" + roll1 + "* and wins *" + DiceData[id][3] + "* from *" + user1.username + "* who rolled *" + roll2 + "*",
            };
            channel.send({ embeds: [exampleEmbed] });
            AddBalance(DiceData[id][1],DiceData[id][3]*2);
            AddGStats(DiceData[id][1],1,DiceData[id][3]);
            AddGStats(DiceData[id][2],2);
        }
        else if(roll2 > roll1){
        
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Dice',
                description: "*" + user1.username + "* rolls *" + roll2 + "* and wins *" + DiceData[id][3] + "* from *" + user.username + "* who rolled *" + roll1 + "*",
            };
            channel.send({ embeds: [exampleEmbed] });
            AddBalance(DiceData[id][2],DiceData[id][3]);
            AddGStats(DiceData[id][2],1,DiceData[id][3]);
            AddGStats(DiceData[id][1],2);
        }
        else {

            const exampleEmbed = {
                color: 0xffffff,
                title: 'Dice',
                description: "*" + user1.username + "* and *" + user.username + "* rolled *" + roll2 + "* - friendship won.",
            };
            channel.send({ embeds: [exampleEmbed] });
            AddBalance(DiceData[id][1],DiceData[id][3]);
            AddGStats(DiceData[id][1],0);
            AddGStats(DiceData[id][2],0);
        }
    }

    DeleteDiceFully(id);
}

function DeleteDiceByUserId(userid){
    for(let i = 0;i<DiceData.length;i++){
        if(DiceData[i][1] == userid && DiceData[i][0] == 1){
            DeleteDice(i);
            return true;
        }
    }
    return false;
}

function DeleteDiceFully(id){
    //global.client.channels.cache.get(DiceData[id][4]).messages.fetch(DiceData[id][6]).then(message => message.delete());
    //global.client.channels.cache.get(DiceData[id][4]).messages.fetch(DiceData[id][7]).then(message => message.delete());

    for(let j = 0;j<8;j++){
        DiceData[id][j] = 0;
    }
}

function deleteDiceOffers(){
    let timestamp = Math.floor(Date.now() / 1000);
    for(let i = 0; i < DiceData.length;i++){
        //console.log("try delete " + i + " ts : " + timestamp + " " + DiceData[i][5]);
        if(DiceData[i][0] == 1 && DiceData[i][5] < timestamp){
            DeleteDice(i);
        }
    }
}

setInterval(deleteDiceOffers,1000);


module.exports = {
    DeleteDice,CreateDice,DeleteDiceByUserId,AcceptDice
};

function pusharr(){
    DiceData.push([0,0,0,0,0,0,0]);
}