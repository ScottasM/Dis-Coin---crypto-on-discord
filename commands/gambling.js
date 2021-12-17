exports.run = (client, message, args) => {
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Gambling information',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: 'Currently gambling is only available between users. You can expect games that lets you gamble with the bot in the future\nUsing the same command will cancel the game offer if noone has accepted it yet\n\u200B',
        fields:[
            {name:".ginfo",value:"Check your gambling statistics"},
            {name:".dice",value:"Play dice with other users"},
            {name:".coinflip",value:"Play coinflip with other users"},
            {name:".jackpot",value:"Create a jackpot that multiple users can compete in"},
            {name:"More games",value:"coming soon"},
        ],
        footer: {
            text: 'Creator: Michael_Scott#6544',
            timestamp: new Date()
        },
    };
    
    message.channel.send({ embeds: [exampleEmbed] });
}