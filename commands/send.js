const { AddBalance, GetBalance,errorMessage } = require("../Functions.js");


exports.run = (client, message, args) => {

    if(!message.member.roles.cache.has('908068327581163541')){
        errorMessage(message.channel,"This command is only available for testers. Please wait for an application to tester team to be announced");
        return;
    }

    Receiver = 0;
    if(!message.mentions.users.first())
        Receiver = null;
    else
        Receiver = message.mentions.users.first().id;
    if(Receiver == null || Receiver == message.author.id){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: 'You have to tag the user you want to send D-C to.',
        };
        message.channel.send({ embeds: [exampleEmbed] });
        return;
    }

    if(args[1]==null || isNaN(args[1])){
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: 'You have to input the sending amount.',
        };
        message.channel.send({ embeds: [exampleEmbed] });
        return;
    }

    if(args[1] < 1)
    {
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: 'Minimum ammount is 1 D-C.',
        };
        message.channel.send({ embeds: [exampleEmbed] });
        return;
    }

    var balance = GetBalance(message.author.id);
    
    if(!balance || balance < parseInt(args[1])) {
        const exampleEmbed = {
            color: 0xffffff,
            title: 'Error',
            description: "You don't have enough D-C in your discord wallet",
        };
        message.channel.send({ embeds: [exampleEmbed] });
        return;
    }

    AddBalance(Receiver,args[1]);
    AddBalance(message.author.id,-parseInt(args[1]));


    const exampleEmbed = {
        color: 0xffffff,
        title: 'Success',
        description: `You successfully sent ${global.client.users.cache.get(Receiver).username} `+args[1]+` D-C (` +args[1]*global.Price + `$)`,
    };
    message.channel.send({ embeds: [exampleEmbed] });
}


