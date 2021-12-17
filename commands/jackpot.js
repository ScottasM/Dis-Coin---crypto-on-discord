const { DeleteFlipByUserId, CreateFlip, AcceptFlip, DeleteFlip } = require("../casino/coinFlipCore");
const { CreatePot } = require("../casino/jackPotCore");
const { errorMessage } = require("../Functions");

let cantCreateDice = {
    "1" : {
        cantuse : 0
    }
};

exports.run = (client, message, args) => {
    
    if(!message.member.roles.cache.has('908068327581163541')){
        errorMessage(message.channel,"This command is only available for testers. Please wait for an application to tester team to be announced");
        return;
    }
    

    if(args[0] == null || args[1] == null){
        errorMessage(message.channel,"Usage : .jackpot [maximum D-C amount] [maximum players]");
        return ;
    }

    let maxamount = parseInt(args[0]),maxplayers = parseInt(args[1]);

    if(maxamount < 20 && maxamount != 0){
        errorMessage(message.channel,"Maximum jackpot amount cannot be less than 20. For unlimited use 0");
        return;
    }
    if(maxplayers < 2 && maxplayers != 0){
        errorMessage(message.channel,"Maximum players cannot be less than 2. For unlimited use 0");
        return;
    }

    let userid = message.author.id;

    if(!cantCreateDice[userid])
        cantCreateDice[userid] = {cantuse:0};

    if(cantCreateDice[userid].cantuse < Math.floor(Date.now() / 1000) && cantCreateDice[userid].cantuse != null && cantCreateDice[userid].cantuse != 0){
        errorMessage(message.channel,"You can only use this command every minute");
        return;
    }
    CreatePot(message.channel,maxamount,maxplayers);
    message.delete();
}