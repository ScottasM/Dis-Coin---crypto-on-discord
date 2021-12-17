const { DeleteDiceByUserId, CreateDice, AcceptDice, DeleteDice } = require("../casino/diceCore");
const { errorMessage } = require("../Functions");

let cantUseDice;

exports.run = (client, message, args) => {

    if(!message.member.roles.cache.has('908068327581163541')){
        errorMessage(message.channel,"This command is only available for testers. Please wait for an application to tester team to be announced");
        return;
    }
        

    if(args[0] == null){
        let suc = DeleteDiceByUserId(message.author.id);
        if(suc){
            const exampleEmbed = {
                color: 0xffffff,
                title: 'Sucess',
                description: 'Dice offer has been sucesfully canceled.',
            };
            message.channel.send({ embeds: [exampleEmbed] });
        }
        else
            errorMessage(message.channel, "To create a dice offer use - .dice [tag user] [amount]. If you were trying to cancel an offer you can relax - no offers in your name are created.");
    }
    else if(!message.mentions.users.first()){
        if(!isNaN(args[0])){
            if(parseInt(args[0]) < 0)
                errorMessage(message.channel,"Dice offer id can't be less than 0.");
            let suc = AcceptDice(message.author,message.channel,args[0]);
            if(!suc)
                errorMessage(message.channel,"Dice offer with such id doesn't exist. It might have expired.");
        }
    }
    else{
        if(isNaN(args[1]) || args[1] < 10 || args[1] == null){
            errorMessage(message.channel,"Please check the amount you have provided. It must be a number and not less than 10");
            return;
        }
            
        CreateDice(message.channel,message.author,message.mentions.users.first(),parseInt(args[1]),message.id);
        message.delete();
    }
}