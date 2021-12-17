const { addMessageDelete } = require("./utils/messageCleanUp");
const {MongoClient} = require('mongodb');
const { resourceLimits } = require("worker_threads");
const { Server } = require("http");



let mClient;
connect();

async function connect(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = ''; // mongodb atlas login link
 

    mClient = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await mClient.connect();
 
        // Make the appropriate DB calls

        mClient.connect((err) => {
            if (!err) {
                console.log('connection created');
            }
            
        })
    } 
    catch (e) {
        console.error(e);
    } 
}

async function SendPM(userid,Var,which){ // 0 - deposit notification, 1 - bind notification
    let user = await global.client.users.fetch(userid);

    switch(which){
        case 0:{
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Deposit',
                description: `You successfully deposited ${Var} D-C (` +parseInt(Var)*global.Price + `$)`,
            };
            user.send({ embeds: [exampleEmbed] });
        }
        case 1:{
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Deposit',
                description: `Your userid was sucessfully binded with BSC wallet address (${Var}) `,
            };
            user.send({ embeds: [exampleEmbed] });
        }
    }
}

async function GetBalance(userid){

    mainDB = mClient.db("Dis-Coin");

    const results = await mainDB.collection("Users").findOne({"userid" : userid},{"_id":0,"balance":1});
    if(results == null)
        return 0;
    else return  parseInt(results.balance);

    /*if(!global.UserData[userid])
        return 0;
    else return parseInt(global.UserData[userid].balance);*/
}

function AddBalance(userid,amount){

    let bal = parseInt(amount);
    mainDB = mClient.db("Dis-Coin");

    mainDB.collection("Users").updateOne(
        { "userid" : userid },
        { $inc: {"balance": bal} },
        { upsert: true }
    );
}

function AddGStats(userid,w,amount = 0){ // 0 - draw, 1 - win, 2 - loss
    mainDB = mClient.db("Dis-Coin");
    if(w == 0){
        mainDB.collection("Users").updateOne(
            { "userid" : userid },
            { $inc: {"Total": 1} },
            { upsert: true }
        );
    }
    else if(w == 1){
        mainDB.collection("Users").updateOne(
            { "userid" : userid },
            { $inc: {"Total": 1,"Wins":1,"Won":parseInt(amount)} },
            { upsert: true }
        );
    }
    else if(w == 2){
        mainDB.collection("Users").updateOne(
            { "userid" : userid },
            { $inc: {"Total": 1,"Losses":1} },
            { upsert: true }
        );
    }
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function getRandomIntas(max) {
    return Math.floor(Math.random() * max);
}

async function errorMessage(channel,description,del = false){
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Error',
        description: description,
    };
    if(del){
        let msg = await channel.send({ embeds: [exampleEmbed] });
        addMessageDelete(channel.id,msg.id,5);
    }
    else channel.send({ embeds: [exampleEmbed] });
}

async function sucMessage(channel,description,del = false){
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Success',
        description: description,
    };
    if(del){
        let msg = await channel.send({ embeds: [exampleEmbed] });
        addMessageDelete(channel.id,msg.id,5);
    }
    else channel.send({ embeds: [exampleEmbed] });
}

function theReplacer(key, value) {
    return key === "balance" ? +value : value;
}


// server save/load

async function GetServerData(serverid){
    mainDB = mClient.db("Dis-Coin");
    const server = await mainDB.collection("Servers").findOne({"serverid":serverid});
    return server;
}

function SaveServerData(serverid,w/*0 - add balance, 1 - add role, 2 - delete role, 3 - toggle donations, 4 - add +1 to current*/,variable){
    mainDB = mClient.db("Dis-Coin");


    switch(w){
        case 0:{
            mainDB.collection("Servers").updateOne(
                { "serverid" : serverid },
                { $inc: {"balance": variable}} ,
                { upsert: true }
            );
            break;
        }
        case 1:{
            mainDB.collection("Servers").updateOne(
                { "serverid" : serverid },
                { $push: {"Shop.Roles": variable}} ,
                { upsert: true }
            );
            break;
        }
        case 2:{
            mainDB.collection("Servers").updateOne(
                { "serverid" : serverid },
                { $pull: {"Shop.Roles": variable}} ,
                { upsert: true }
            );
            break;
        }
        case 3:{
            mainDB.collection("Servers").updateOne(
                { "serverid" : serverid },
                { $set: {"Shop.donations": variable}} ,
                { upsert: true }
            );
        }
        case 4:{
            mainDB.collection("Servers").updateOne(
                { "serverid" : serverid, "Shop.Roles.roleid":variable },
                { $inc: {"Shop.Roles.$.current": 1}}
            );
        }
    }
    
}


module.exports = {
    SendPM,formatNumber,GetBalance,AddBalance,getRandomIntas,errorMessage,theReplacer,mClient,AddGStats,GetServerData,SaveServerData,sucMessage
};