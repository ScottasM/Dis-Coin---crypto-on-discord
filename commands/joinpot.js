
const { JoinPot,leavePot } = require("../casino/jackPotCore");
const { errorMessage } = require("../Functions");

let cantUseDice;

exports.run = (client, message, args) => {

    if(!message.member.roles.cache.has('908068327581163541')){
        errorMessage(message.channel,"This command is only available for testers. Please wait for an application to tester team to be announced");
        return;
    }


    if(args[0] == null && args[1] == null){
        let suc = leavePot(message.author.id);
        if(!suc)
            errorMessage(message.channel,"Usage : .joinpot [jackpot id] [entry amount]. You can also use only .joinpot to leave a jackpot if you're already in one");
        return ;
    }
    
    let potid = parseInt(args[0]),entry = parseInt(args[1]);
    if(potid < 0){
        errorMessage(message.channel,"Jackpot id cannot be less than 0",true);
        return;
    }
    if(entry < 1){
        errorMessage(message.channel,"Entry amount cannot be less than 0",true);
        return ;
    }
    JoinPot(message.author,message.channel,potid,entry);
    return;
}