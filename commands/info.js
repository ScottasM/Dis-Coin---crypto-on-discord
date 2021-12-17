exports.run = (client, message, args) => {
    const exampleEmbed = {
        color: 0xffffff,
        title: 'Dis-Coin information',
        thumbnail: {url:'https://media.discordapp.net/attachments/879346086110699542/906629030088953917/D_1_1_2-modified.png'},
        description: '**Our token allows easy money management inside of discord.**\n\nDid you ever get help from someone and thought that a simple thank you is not enough?\n\
            Have you ever wanted to gamble some money with your friends, but you could not find an easy way to do that?\n\
            Or maybe you wanted to have donator roles in your server, but services like patreon are too complex to set up and hard to too much of a hassle to deal with?\n\n\
            **Dis-Coin lets you do just that and more in a easy way while just hanging out on discord.**\n\u200B',
        fields:[
            {name:"Total supply",value:"10,000,000 (10 million)"},
            {name:"Price",value:"0.0 $"},
            {name:"Liquidity",value:"0 $\n\u200B"}
        ],
        footer: {
            text: 'Creator: Michael_Scott#6544',
            timestamp: new Date()
        },
    };
    
    message.channel.send({ embeds: [exampleEmbed] });

}